//Made By Nikhil Sharma On Date 24/09/2024

const express=require('express')
const app=express()
const port=3000
const path=require('path')
const mongoose=require('mongoose')
const ejsMate=require('ejs-mate')
const asyncWrap=require('./utilities/asyncWrap.js')
const ExpressError=require('./utilities/ExpressError.js')
const Course=require('./models/courses.js')
const Review=require('./models/review.js')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const {courseSchema,reviewSchema}=require('./schema.js')
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
main()
.then(()=>{
    console.log('Connection Set')
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://nikhilpandit:lHrjQU79nbwD21vo@cluster0.khqie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

}


const validateReview= function(req,res,next){
    let result= reviewSchema.validate(req.body)
   
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    
    }else{
        next()
    }
}

app.post('/courses:id/chapter:chapter_id/reviews:sno',validateReview,asyncWrap(async(req,res,next)=>{
    let {id,chapter_id,sno}=req.params
    let course= await Course.findById(id)
    let chapter= await course.chapters[sno-1]
    let newReview= new Review(req.body.review)
    chapter.reviews.push(newReview)
    await newReview.save();
    await course.save();
     res.redirect(`/courses${course._id}/chapter${chapter_id}/${sno}`)
      
       
     
    }))


app.get('/',async(req,res)=>{
    const allData= await Course.find({})
    res.render('course/index',{allData})
})
app.get('/courses', asyncWrap(async(req,res)=>{
    const allData= await Course.find({})
    res.render('course/index',{allData})
}))

app.get('/courses/short:id', asyncWrap(async(req,res)=>{


    const{id}=req.params
    let allData=[]
    if(id=="na"){
     allData= await Course.find({}).sort({name:1});  
    }
    if(id=="da"){
         allData= await Course.find({}).sort({date:-1});  
    }
    if(id=="ra"){
         allData= await Course.find({}).sort({"chapters.reviews":-1});  
    }
    if(id=="do"){
         allData= await Course.find({}).sort({domain:1});  
    }
  
   
    res.render('course/index',{allData})
}))


app.delete('/courses:id/chapters:chapter_id/:sno/review:review_id', asyncWrap(async(req,res)=>{
    const {id,chapter_id,sno,review_id}=req.params
    await Review.findByIdAndDelete(review_id);

    // Update the course document to pull the review from the specific chapter
    const course = await Course.findOneAndUpdate(
      { _id: id, 'chapters._id': chapter_id },  // Match course and chapter
      { $pull: { 'chapters.$.reviews': review_id  } },  // Pull review from chapter
      { new: true }  // Return the updated document
    );
  
  
 res.redirect(`/courses${id}/chapter${chapter_id}/${sno}`)
  
 }))

app.get('/courses:id', asyncWrap(async(req,res)=>{
    const {id}=req.params
  
    const key= await Course.findById(id)
  
    res.render('course/show-single',{key})
}))

app.get('/courses:id/chapter:chapter_id/:sno', asyncWrap(async(req,res)=>{
    const {id,chapter_id,sno}=req.params
  
    const key= await Course.findById(id)


 const total= await  Course.findById(id)
  .populate({ 
     path: 'chapters',
     populate: {
       path: 'reviews',
       model: 'Review'
     } 
  })

  const totalReviews=total.chapters[sno-1]['reviews']
  const chapter=key.chapters[sno-1]
    res.render('course/single-chapter',{chapter,sno,id,totalReviews})
}))






app.all('*',(req,res,next)=>{
    next(new ExpressError(405,"Page Not Found"))
})

 

app.use((err,req,res,next)=>{
  console.log(err);
 res.render('error' ,{err})
})
 


app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
})

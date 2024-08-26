const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Review=require('./review.js')
const model=mongoose.model

const courseSchema=new Schema({
    name:{
        type:String,
        required:true,
        default:null
    },
    
    date:{
        type:Number,
        required:true,
        default:new Date()
    },
    description:{
        type:String,
        required:true,
        default:null
    },
    
    domain:[{
        type:String,
        required:true,
        default:null
    }],
    chapters:[{
     
        name:{
            type:String,
            required:true,
            default:null
        },
        text:{
           
            type:String,
            required:true,
            default:null
        },
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
        }]
       
    }],
    created_at:{
        type:Date,
        required:true,
        default:new Date()
    },
})





courseSchema.post("findOneAndDelete",async (course)=>{

    await Review.deleteMany({_id:{$in:course.reviews}})
       
    })



const Course=model('course',courseSchema)


module.exports=Course;
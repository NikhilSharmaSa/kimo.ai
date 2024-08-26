const mongoose=require('mongoose')

const Schema=mongoose.Schema
const model=mongoose.model

const reviewSchema=new Schema({
    comment:{
        type:String,
        required:true,
        default:null
    },
  
    rating:{
        type:Number,
        required:true,
        default:null,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        required:true,
        default:new Date()
    },
    updated_at:{
        type:Date,
        required:true,
        default:new Date()
    },
    Status:{
        type:String,
        required:true,
        default:'active'
    },
})


const Review=model('Review',reviewSchema)

module.exports=Review;
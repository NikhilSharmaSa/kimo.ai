






const mongoose=require('mongoose')

const Course = require('../models/courses.js')
const jsonData=require('./data.json')

main().then(()=>{
    console.log('connection set');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/kimo');

}






 const insertData=async(req,res)=>{
    await Course.deleteMany({});
    await  Course.insertMany(jsonData)
console.log('Data Init Success')
}


insertData()
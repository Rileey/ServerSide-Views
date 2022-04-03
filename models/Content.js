import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
    unique:false
},
 videoHD: {
     type: Array
 },
 videoFHD: {
    type: Array
},
 video2k: {
    type: Array
},
 video4k: {
    type: Array
},
 year: {
     type: Number
 },
 ageLimit: {
     type: Number
 },
 duration:{
     type: String
 },
 description:{
    type: String
},
 director: {
    type: String
 },
 genre: {
     type: String
 }
}, 
{
    timestamps: true 
})

const Content = mongoose.model("Content", ContentSchema)

export default Content;




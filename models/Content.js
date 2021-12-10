import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
},
 video: {
     type: Array
 },
 year: {
     type: String
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
 },
}, 
{
    timestamps: true 
})

const Content = mongoose.model("Content", ContentSchema)

export default Content;




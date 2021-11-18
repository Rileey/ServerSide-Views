import { Schema, model } from 'mongoose';

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
     description: {
        type: String
     },
     image: {
        type: String
     },
     thumbnail: {
        type: String
     },
     trailer: {
        type: String
     },
     video: {
         type: String
     },
     year: {
         type: String
     },
     ageLimit: {
         type: Number
     },
     genre: {
         type: String
     },
     isSeries: {
         type: Boolean,
         default: false
     }
}, 
{
    timestamps: true 
})

const Movie = model("Movie", MovieSchema)

export default Movie;
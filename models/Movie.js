import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
    title: {
    type: String,
    },
    image: {
        type: Array
    },
     thumbnail: {
        type: Array
    },
     trailer: {
        type: Array
    },
     year: {
         type: String
    },
     ageLimit: {
         type: Number
    },
     description:{
        type: String
    },
     duration:{
         type: String
    },
     director: {
        type: String
    },
     genre: {
         type: String
    },
    content: {
        type: Array
    },
    public_id: {
        type: Array
    },
    isSeries: {
        type: Boolean,
        default: false,
    }
}, 
{
    timestamps: true 
})

const Movie = mongoose.model("Movie", MovieSchema)

export default Movie;



// title: {
//     type: String,
//     unique: true
// },
//  description: {
//     type: String
//  },
//  image: {
//     type: String
//  },
//  thumbnail: {
//     type: String
//  },
//  trailer: {
//     type: String
//  },
//  video: {
//      type: String
//  },
//  year: {
//      type: String
//  },
//  ageLimit: {
//      type: Number
//  },
//  duration:{
//      type: String
//  },
//  director: {
//     type: String
//  },

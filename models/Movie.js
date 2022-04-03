import mongoose from 'mongoose';
const Schema = mongoose.Schema


const MovieSchema = new Schema({
    title: {
    type: String,
    unique: false
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
    // content:[
        //  {contentId: 
        //     {type: Schema.Types.ObjectId,ref: "Content"}
        // } 
        // ],
    content: [{
        type: Schema.Types.ObjectId,
        ref: 'Content'
    
    }],
    // public_id: {
    //     type: Array
    // },
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


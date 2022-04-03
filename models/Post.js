import mongoose from 'mongoose';
const Schema = mongoose.Schema


const PostSchema = new Schema({
    video: {
        type: Array
    },
    description:{
        type: String
    },
    _creator: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    _comments: [{
        type: Schema.Types.ObjectId, 
        ref: 'Comment'
    }],
     category: {
         type: String
    },
    likes: [],
    upvotes: []
}, 
{
    timestamps: true 
})

const Post = mongoose.model("Post", PostSchema)

export default Post;


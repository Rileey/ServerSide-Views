import mongoose from 'mongoose';
const Schema = mongoose.Schema


const CommentSchema = new Schema ({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean, 
        default:false
    },
    _creator: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }, 
    _post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},
{timestamps: true}
);


const Comment = mongoose.model('Comment', CommentSchema);

export default Comment


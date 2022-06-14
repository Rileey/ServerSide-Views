import mongoose from 'mongoose';
const Schema = mongoose.Schema

const UserSchema = new Schema({
   username: {
      type: 'string',
      unique: true,
   },
    phoneNumber: {
        type: Number,
        required: true,
        unique: false,
    },
     email: {
        type: String,
        required: true,
        unique: true,
     },
     password: {
        type: String,
        required: true,
     },
     confirmPassword: {
        type: String,
        required: true,
     },
     profilePicture: {       
      type: Array,
      },
      about: {
         type: String,
      },
      followers: Array,
      following: Array,
      _posts: [{
         type: Schema.Types.ObjectId, 
         ref: 'Post'
      }],
     isAdmin: {
        type: Boolean,
        default: false
     },
}, 
{
    timestamps: true 
})

const User = mongoose.model("User", UserSchema)

export default User
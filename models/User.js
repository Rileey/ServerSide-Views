import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
     email: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        default: ""
     },
     isAdmin: {
        type: Boolean,
        default: false
     },
     fullName: {
        type: String
     },
     address: {
        type: String
     },
}, 
{
    timestamps: true 
})

const User = mongoose.model("User", UserSchema)

export default User
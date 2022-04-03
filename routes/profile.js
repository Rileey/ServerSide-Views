import express from 'express'
const router = express.Router();
import Post from "../models/Post.js"
import User from "../models/User.js"
import Comment from '../models/Comments.js';
import cloudinary from '../utils/cloudinary.js';
import { storage, SUpload } from '../utils/cloud.js';
import verify from '../verifyToken.js'


//get your posts
router.get("/posts/user/:email", async (req, res) => {
    const { email } = req.params
    try{
        const user = await User.findOne({email : email})
        const posts = await Post.find({ _creator: user._id }) 
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
})

export default router
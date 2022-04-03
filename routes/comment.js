import express from 'express'
const router = express.Router();
import Comment from '../models/Comments.js';
import Post from "../models/Post.js";
import cloudinary from '../utils/cloudinary.js';
import { storage, SUpload } from '../utils/cloud.js';
import verify from '../verifyToken.js'

//post comment
// post a comment
router.post("/", (req, res) => {
    const { 
        text, 
        userId, 
        postId
    } = req.body;

    const comment = new Comment({
        text,
        _creator: userId,
        _post: postId
    });

    comment.save().then((nc) => {
        Post.findByIdAndUpdate(
            postId,
            { $push: {"_comments": nc._id} }
            ).then((existingPost) => {
                res.status(200).json({
                    success: true,
                    data: nc,
                    existingPost,
                });
            }).catch((err) => {
                 res.status(500).json({
                    message: err.toString()
                });
            });
    }).catch((err) => {
        res.status(500).json({
            message: err.toString()
        });
    });
})

//get a comment
    router.get("/find/:id", async (req, res) => {
        try{
            const { commentId } = req.params;
            const getOneComment = await Comment.findById({ _id: commentId })
            .populate({
                path: "_creator",
                select: "name createdAt"
            })
            .populate({
                path: "_post",
                select: "text"
            })
            if (getOneComment !== null) {
                res.status(200).json({getOneComment}).status("Success")
            } else {
                res.status(404)
                .send({ message: `there are no comments with this id` })
            }
        } catch (err) {
            console.log(err)
            res.status(400).send({ message: `Invalid comment id `})
        }
    }),


//get all comments
router.get('/', (req, res) => {
        const getAllComments = Comment.find({})
        .populate({
            path: "_creator",
            select: "name createdAt"
        })
        .populate({
            path: "_post",
            select: "text"
        })
        .then((comments) => {
            return res.status(200).json({
                Status: "Success",
                data: comments
            })
        }).catch((err) => {
        return res.status(500).json({
            message: err.toString()
        });
    });
        
    }),


    // edit comment
    router.put('/', async(req, res) => {
        try {
            
            const { commentId } = req.params
            const comment =  req.body
            await Comment.findOneAndUpdate({ _id: commentId }, comment, {new: true},
                (err, result) => {
                    if (err){
                        res.status(404).send({
                            message: `there are no comments to update`
                        })
                        throw err;
                    }
                    res.status(200).send({
                        message: `comment with id: ${commentId} has been updated`,
                    })
                })
            } catch (err) {
                res.status(400).send({
                    message: `Invalid comment id`
                })
            }
    }),


    //delete comment
    router.delete('/', (req, res) => {
        try {

            const { commentId } = req.params
            const deletePost = Comment.find({ _id: commentId})
            .deleteOne((err) => {
                if (err){
                    res.status(404).send({
                        message: `the comment with this id doesn't exist`
                    })
                    throw err;
                } res.status(200).send({
                    message: `deleted comment with the id: ${commentId}`
                })
                
            })

        } catch (err) {
            res.status(400).send({
                message: `Invalid comment  id`
            })
        }
    })

export default router;
import express from 'express'
const router = express.Router();
import Post from "../models/Post.js"
import User from "../models/User.js"
import Comment from '../models/Comments.js';
import cloudinary from '../utils/cloudinary.js';
import { storage, SUpload } from '../utils/cloud.js';
import verify from '../verifyToken.js'

router.post('/',
//  SUpload.array('image'), 
 SUpload.fields([{
    name: 'video', maxCount: 1
  }]), async (req, res) => {
        const {
            description,
            category,
            userId
        } = req.body;

        const newPost = new Post({
            description,
            category,
            _creator: userId,
        });

            try {
                if (!req.files){
                    // console.log(req.file, 'files');
                    const error = new Error('No File')
                    console.log(error)
                    return res.status(400).json({message: "We need a file"});
                }

                if (req.files) { // if you are adding multiple files at a go
                    const video = []; // array to hold the image urls
                    const files = req.files.video; // array of images
                    for (const file of files) {
                        const { path, filename } = file;
                        video.push({
                            video: path,
                            public_id: filename
                        });
                    };

                    newPost.video = video;
                }
                const savedPost = await newPost.save();


                const person = await User.findById(userId);
                if (!person._posts.includes(savedPost._id)) {
                    await person.updateOne({ $push: {_posts: savedPost._id}})
                    res.status(200).json({
                        Message: {msg: `The post has been pushed`, post: person._posts},
                        data: person,
                        savedPost: savedPost
                    });
                }
                // } else {
                //     await person.updateOne({ $pull: {_posts: userId}})
                //     res.status(200).json(`The post has been removed`);
                // }










                
                // return res.status(201).json({ savedPost });
            } catch (err) {
                console.log(err, '$$$$$$$');
                return res.status(400).json({message: "cloudinary error", error: err})
            }
});



// timeline posts
    router.get("/timeline/:userId", async(req, res) => {
        const { userId } = req.params;
        try {
            //get a user by Id
            const user = await User.findById(userId);
            // Get posts by user
            const posts = await Post.find({ _creator: user._id })
            .populate({
                path: "_creator",
                select: "email profilePicture username createdAt _id"
            })
            ;
            // Get posts by users you follow
            const communityPost = await Promise.all(
                user.following.map((communityId) => {
                    return Post.find({_creator: communityId})
                    .populate({
                        path: "_creator",
                        select: "email profilePicture username createdAt _id"
                    })
                    ;
                })
            );
            res.status(200).json(posts.concat(...communityPost))
        } catch (err) {
            res.status(500).json({
                message: err.toString
            })
        }

    }),


// get all posts
    router.get("/", async (req, res) => {
        Post.find({})
        .populate({
            path: "_creator",
            select: "email profilePicture username createdAt _id"
        })
        .populate({
            path: "_comments",
            select: "text createdAt _creator",
            match: { "isDeleted": false}
        })
        .then((posts) => {
            return res.status(200).json({
                Success: true,
                data: posts
            }); 
        }).catch((err) => {
            return res.status(500).json({
                message: err.toString()
            });
        });
    }),

//get your posts
// router.get("/user/:email", async (req, res) => {
//         const { email } = req.params
//         try{
//             const user = await User.findOne({email : email})
//             const posts = await Post.find({ _creator: user._id }) 
//             res.status(200).json(posts)
//         } catch (err) {
//             res.status(500).json(err);
//         }
//     }),

//getOnepost
    router.get("/find/:id", async (req, res) => {
        try{
        const { id } = req.params;
        const getOnePost = await Post.findById({ _id: id})
        .populate({
            path: "_creator",
            select: "email profilePicture username createdAt _id"
        })
        
        if (getOnePost !== null) {
            res.status(200).json({getOnePost }).status('success');
          } else {
             res
               .status(404)
               .send({ message: `there are no posts with this id` })
        }
        } catch (err) {
          console.log(err)
          res.status(400).send({ message: `Invalid post id` });
        }

    }),

//edit post
    router.put('/:id', 
     SUpload.fields([{
        name: 'video', maxCount: 1
      }]), async (req, res) => {
            
        const { title, description, category } =  req.body


            try {

        let updatedPost = await Post.findById(req.params.id)

        if (req.files) {
            await cloudinary.api.delete_resources([updatedPost.video[0].public_id], {
                resource_type: 'video'
            },

                function (err, result) {console.log(result, err, 'video')
                })

                const video = []; // array to hold the image urls
                const files = req.files.video; // array of images
                for (const file of files) {
                    const { path, filename } = file;
                    video.push({
                        video: path,
                        public_id: filename
                    });
                };

                updatedPost.video = video

                const data = {
                    title: title || updatedPost.title,
                    description: description || updatedPost.description,
                    category: category || updatedPost.category,
                    video: video || updatedPost.video,
                 }

                 updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: data,
                 },
                 //RETURN NEW USER
                 {
                     new: true
                 });
                 return res.status(200).json({result: updatedPost});
                } else {
                    try {
                        const updatedPost = await Post.findByIdAndUpdate(req.params.id,
            
                            // UPDATE FIRST
                            {$set: req.body},
                            
                            //RETURN NEW USER
                            {new: true});
                            return res.status(200).json(updatedPost)
                    } catch (err) {
                        console.log(err.message)
                    }
                }
             } catch (err) {
                 res.status(500).json({message: err})
             }
    }),

// like/dislike post
    router.put("/:id/like", async (req, res) => {
        const { id } = req.params;
        const { userId } = req.body;

        try {
            const post = await Post.findById(id);
            if (!post.likes.includes(userId)) {
                await post.updateOne({ $push: {likes: userId}})
                res.status(200).json({
                    Message: `The post has been liked`,
                    data: post
                });
            } else {
                await post.updateOne({ $pull: {likes: userId}})
                res.status(200).json(`The post has been disliked`);
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }),



// upvote/downvote post
router.put("/:id/upvote", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post.upvotes.includes(userId)) {
            await post.updateOne({ $push: {upvotes: userId}})
            res.status(200).json({
                Message: `The post has been upvoted`,
                data: post
            });
        } else {
            await post.updateOne({ $pull: {upvotes: userId}})
            res.status(200).json(`The post has been downvoted`);
        }
    } catch (err) {
        res.status(500).json(err)
    }
}),


//delete post
    router.delete('/:id', async (req, res) => {
            //fetch the post using the movie id and delete the user.
            try {
                let post = await Post.findById(req.params.id);
                const person = await User.findById(post._creator._id);
                if(post.video){
                    await cloudinary.api.delete_resources([post.video[0].public_id],{
                        resource_type: 'video'
                    },
                        function (err, result) {console.log(result, err, 'video')
                       })
                } else {
                    return post
                }
                await Post.findByIdAndDelete(req.params.id)
                if (person._posts.includes(post._id)) {
                    await person.updateOne({ $pull: {_posts: post._id}})
                }
                res.status(200).json({message: `The Post with id ${req.params.id} has been deleted.`, deleted: post, removed: person._posts._id});
        } catch (err) {
            res.status(400).send({
                message: `Invalid post id`
            })
        }
        
    })
export default router
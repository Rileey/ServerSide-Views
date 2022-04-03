import express from 'express'
const router = express.Router();
import User from '../models/User.js';
import CryptoJS from 'crypto-js';
import verify from '../verifyToken.js'
import cloudinary from '../utils/cloudinary.js';
import { storage, SUpload } from '../utils/cloud.js';


//UPDATE

router.put('/:id',
SUpload.fields([{
    name: 'profilePicture', maxCount: 1
  }]), async (req, res) => {
    // if the your user id is the same as the the one you are requesting or you are the admin
    const {userId, username, email, about, password} = req.body
    const {id} = req.params
     if (userId === id ) {
         //if the inputed password is the same, encrypt it
         if (password) {
             try {
                 password = CryptoJS.AES.encrypt(
                     password,
                     process.env.SECRET_KEY
                 ).toString();
             } catch (err) {
                 return res.status(500).json(err)
             }
         }
         
         try {
            let updatedUser = await User.findById(id)
            //then fetch the user, using the user id.
            if (req.files.profilePicture) {
                await cloudinary.api.delete_resources([updatedUser.profilePicture
                    [0].public_id
                ],
                    function (err, result) {console.log(result, err, 'image')
                    })
                    const profilePicture = []; // array to hold the image urls
                    const files = req.files.profilePicture; // array of images
                    for (const file of files) {
                        const { path, filename } = file;
                        profilePicture.push({
                            profilePicture: path,
                            public_id: filename
                        });
                    };
         
                    updatedUser.profilePicture = profilePicture;

                    const data = {
                        username: username || updatedUser.username,
                        email: email || updatedUser.email,
                        about: about || updatedUser.about,
                        profilePicture: profilePicture || updatedUser.profilePicture,
                     }
                    
                     //then fetch the user, using the user id.
                     updatedUser = await User.findByIdAndUpdate(id, {
                        $set: data,
                     },
                     //RETURN NEW USER
                     {
                         new: true
                     });
                
                // UPDATE FIRST
                // {$set: req.body},
                
                // //RETURN NEW USER
                // {
                //     new: true
                // });
                console.log(updatedUser)
             res.status(200).json({msg: `user has been updated`,data: updatedUser});

            } else {
                try {
                    //then fetch the user, using the user id.
                    const updatedUser = await User.findByIdAndUpdate(id,
        
                        // UPDATE FIRST
                        {$set: req.body},
                        
                        //RETURN NEW USER
                        {new: true});
                        return res.status(200).json({msg: `user has been updated`,data: updatedUser})
                } catch (err) {
                    console.log(err.message)
                }
            }
         } catch (err) {
             res.status(500).json(err)
             console.log(err)
         }
     } else {
         res.status(403).json(`You can update only your account`)
     }
})



// //edit post
// router.put('/:id', 
// SUpload.fields([{
//    name: 'video', maxCount: 1
//  }]), async (req, res) => {
       
//    const { title, description, category } =  req.body


//        try {

//    let updatedPost = await Post.findById(req.params.id)

//    if (req.files) {
//        await cloudinary.api.delete_resources([updatedPost.video[0].public_id], {
//            resource_type: 'video'
//        },

//            function (err, result) {console.log(result, err, 'video')
//            })

//            const video = []; // array to hold the image urls
//            const files = req.files.video; // array of images
//            for (const file of files) {
//                const { path, filename } = file;
//                video.push({
//                    video: path,
//                    public_id: filename
//                });
//            };

//            updatedPost.video = video

//            const data = {
//                title: title || updatedPost.title,
//                description: description || updatedPost.description,
//                category: category || updatedPost.category,
//                video: video || updatedPost.video,
//             }

//             updatedPost = await Post.findByIdAndUpdate(req.params.id, {
//                $set: data,
//             },
//             //RETURN NEW USER
//             {
//                 new: true
//             });
//             return res.status(200).json({result: updatedPost});
//            } else {
//                try {
//                    const updatedPost = await Post.findByIdAndUpdate(req.params.id,
       
//                        // UPDATE FIRST
//                        {$set: req.body},
                       
//                        //RETURN NEW USER
//                        {new: true});
//                        return res.status(200).json(updatedPost)
//                } catch (err) {
//                    console.log(err.message)
//                }
//            }
//         } catch (err) {
//             res.status(500).json({message: err})
//         }
// }),




//DELETE

router.delete('/:id', verify, async (req, res) => {
    // if the your user id is the same as the the one you are requesting or you are the admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
        //fetch the user using the user id and delete the user.
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json(`user with id ${req.params.id} has been deleted.`);
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if the user id is not the same as the one requested or you are not the admin,
        //then return this response 'You can only delete your account'
        res.status(403).json(`You can delete only your account`)
    }
})

//GET

router.get('/find/:id', async (req, res) => {
    //fetch the user using the user id.
        try {
            const user = await User.findById(req.params.id);

            //single out the password and remove it from the rest of the information displayed.
            const { password, ...info } = user._doc
            //return the user's information
            res.status(200).json(info);
        } catch (err) {
            //catch any errors.
            res.status(500).json(err)
        }
})

//follow user

router.put('/:id/follow', async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    if ( userId !== id ){
        try {
            const user = await User.findById(id)
            const currentUser = await User.findById(userId)
            if (!user.followers.includes(userId)){
                await user.updateOne({ $push: {followers: userId}})
                await currentUser.updateOne({ $push: {following: id}})
                res.status(200).json(`user ${id} has been followed`);
            } else {
                res.status(404).json(`you already follow this user`)
            }
        } catch (err) {
            res.status(500).json(err.toString())
        }
    } else {
        res.status(404).json(`you can't follow yourself`);
    }
}),


//unfollow user

router.put('/:id/unfollow', async (req, res) => {
    const { id } = req.body;
    const { userId } = req.params;
    if ( userId !== id ){
        try {
            const user = await User.findById(userId)
            const currentUser = await User.findById(id)
            if (user.followers.includes(id)){
                await user.updateOne({ $pull: {followers: id}})
                await currentUser.updateOne({ $pull: {following: userId}})
                res.status(200).json(`user has been unfollowed`);
            } else {
                res.status(404).json(`you do not follow this user`)
            }
        } catch (err) {
            res.status(500).json(err.toString())
        }
    } else {
        res.status(404).json(`you can't unfollow yourself`);
    }
})





//GET ALL

router.get('/', async (req, res) => {
    const query = req.query.new;
    // if you are the admin
        //get the user using the user id and delete the user.
        try {
            //fetch the last ten users if there is a query, if not fetch all users excluding you
            const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find().populate({
                path: "_posts",
                select: "description createdAt _id"
            })
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err)
        }
})


//GET USER STATS

router.get('/stats', async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear - 1)

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})


export default router

import express from 'express'
const router = express.Router();
import Content from '../models/Content.js';
// import cloudinary from '../utils/cloudinary.js';

import { storage, SUpload } from '../utils/cloud.js';
import cloudinary from '../utils/cloud.js';

import Upload from '../utils/multer.js';
import verify from '../verifyToken.js'


//CREATE A MOVIE

router.post('/', 
// SUpload.single('video'), 
SUpload.fields([{
    name: 'video', maxCount: 1
  }]),
verify, async (req, res) => {

    const { 
        title, 
        description, 
        year, 
        ageLimit,
        duration,
        director,
        genre,
     } = req.body;
     if (req.user.isAdmin) {
    try {
        if (!req.files){
            return res.status(400).json({message: "We need a file"});
        }
            // try {
            //     const result = await cloudinary.uploader.upload( req.file.path, {
            //         resource_type: "auto",
            //         folder: "views"
            //     })
                // const trailer_result = await cloudinary.uploader.upload(req.body.trailer, {
                //     resource_type: "auto",
                //     folder: "views"
                // })
                // const image_result = await cloudinary.uploader.upload(req.body.image, {
                //     resource_type: "auto",
                //     folder: "views"
                // })
                // const video_result = await cloudinary.uploader.upload(req.body.video, {
                //     resource_type: "auto",
                //     folder: "views"
                // })
                let newContent = new Content({
                            title,
                            description,
                            year,
                            ageLimit,
                            duration,
                            description,
                            director,
                            genre,
                        });

                        if (req.files) { // if you are adding multiple files at a go
                            const video = []; // array to hold the video urls // array of videos
                            const vid = req.files.video
                            for (const file of vid) {
                            const { path, filename } = file;
                            video.push({
                                video: path,
                                public_id: filename
                            });
                        };

                            newContent.video = video; // add the urls to object

                        }

                            const savedContent = await newContent.save()
                               res.status(200).json({message: 'success', data: savedContent})
            } catch (err) {
                console.log(err.message);
                return res.status(400).json({message: "cloudinary error", error: err.message})
            }

    }else {
        console.log(err.message);
        res.status(500).json({message: "Server Error"})
    }
});



// router.put('/:id', verify, async (req, res) => {
//     if (req.user.isAdmin){
//         try {
//             const updatedContent = await Content.findByIdAndUpdate(req.params.id,

//                 // UPDATE FIRST
//                 {$set: req.body},
                
//                 //RETURN NEW USER
//                 {new: true});
//                 res.status(200).json(updatedContent)
//         } catch (err) {
//             console.log(err.message)
//         }
//     } else {
//         res.status(403).json(`Only Admin can make changes`)
//     }
// })





//UPDATE CONTENT

router.put('/:id', verify, Upload.single('video'), async (req, res) => {
    // if you are the admin
     if (req.user.isAdmin) {
         try {
             // fetch the movie you want to update
             let updatedContent = await Content.findById(req.params.id) 
             await cloudinary.uploader.destroy(updatedContent.public_id, { resource_type: "video", 
             function(err, result)
             {console.log( err, result) }})
             const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "views"
            });
             const data = {
                title: req.body.title || updatedContent.title,
                description: req.body.description || updatedContent.description,
                year: req.body.year || updatedContent.year,
                ageLimit: req.body.ageLimit || updatedContent.ageLimit,
                duration: req.body.duration || updatedContent.duration,
                description: req.body.duration || updatedContent.description,
                director: req.body.director || updatedContent.director,
                genre: req.body.genre || updatedContent.genre,
                video: result.secure_url || updatedContent.secure_url,
                public_id: result.public_id || updatedContent.public_id
             }
                // UPDATE FIRST
               updatedContent = await Content.findByIdAndUpdate(req.params.id, {
                    $set: data,
                },
                //RETURN NEW USER
                {
                    new: true
                });
             res.status(200).json({result: updatedContent});
         } catch (err) {
             res.status(500).json({message: err})
             console.log(err)
         }
     } else {
         res.status(403).json(`Only admin can make changes`)
     }
})



//DELETE A CONTENT

router.delete('/:id', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        //fetch the movie using the movie id and delete the user.
        try {
            let content = await Content.findById(req.params.id);
            console.log(content.public_id)
            await cloudinary.uploader.destroy(content.public_id, { resource_type: "video", 
            function(err, result)
            {console.log( err, result) }})
            await content.remove()
            res.status(200).json(`The Content with id ${req.params.id} has been deleted.`);
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if the Content id is not the same as the one requested,
        //then return this response 'You can only delete your account' 
        res.status(403).json(`Only admin can make changes`)
    }
})

//GET A Content

router.get('/find/:id', async (req, res) => {
    //fetch the Content using the Content id.
        try {
            const content = await Content.findById(req.params.id);

            //return the Content 
            res.status(200).json(content);
        } catch (err) {
            //catch any errors.
            res.status(500).json(err)
        }
})

//GET A RANDOM MOVIE

// router.get('/random', verify, async (req, res) => {
//     // name the query "type"
//     const type = req.query.type;
//     let content;
//         try {
//             //if the query type is series
//             if (type === 'series'){
//                 // fetch one
//                 content = await Content.aggregate([
//                     { 
//                         $match: { isSeries: true },
//                     },
//                     {
//                         $sample: { size: 1 }
//                     }
//                 ]);
//             } else {
//                 // else fetch a Content
//                 content = await Content.aggregate([
//                     { 
//                         $match: { isSeries: false },
//                     },
//                     {
//                         $sample: { size: 1 }
//                     }
//                 ]);
//             }
//             res.status(200).json(content)
//         } catch (err) {
//             res.status(500).json(err)
//         }
// })


//GET USER STATS

// router.get('/stats', async (req, res) => {
//     const today = new Date();
//     const lastYear = today.setFullYear(today.setFullYear - 1)

//     const monthsArray = [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December',
//     ]

//     try {
//         const data = await User.aggregate([
//             {
//                 $project: {
//                     month: { $month: "$createdAt" },
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$month",
//                     total: { $sum: 1 }
//                 },
//             },
//         ]);
//         res.status(200).json(data)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })


//GET ALL MOVIES

router.get('/', verify, async (req, res) => {
        try {
            const content = await Content.find();
            res.status(200).json(content.reverse());  //.reverse sends the movies in from the last one created.
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     //if user is not admin, return: 'only admin can make changes' 
    //     res.status(403).json(`Only admin can make changes`)
    // }
})


export default router
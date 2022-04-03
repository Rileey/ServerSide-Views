
import express from 'express'
const router = express.Router();
import Content from '../models/Content.js';
// import cloudinary from '../utils/cloudinary.js';

import { storage, SUpload } from '../utils/cloud.js';
import cloudinary from '../utils/cloud.js';

import Upload from '../utils/multer.js';
import verify from '../verifyToken.js'




router.post('/', 
// SUpload.single('video'), 
SUpload.fields([{
    name: 'videoHD', maxCount: 1
  }, {
    name: 'videoFHD', maxCount: 1
  }, {
    name: 'video2k', maxCount: 1
  }, {
    name: 'video4k', maxCount: 1
  }]), async (req, res) => {

    const { 
        title, 
        description, 
        year, 
        ageLimit,
        duration,
        director,
        genre,
     } = req.body;
    //  if (req.user.isAdmin) {
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

                        // console.log(req.files, '&&&')
                        if (req.files.videoHD) { // if you are adding multiple files at a go
                            const videoHD = []; // array to hold the video urls // array of videos
                            const vid = req.files.videoHD
                            // if(!vid){
                            //     return videoHD
                            // } else {
                            for (const file of vid) {
                            const { path, filename } = file;
                            videoHD.push({
                                video: path,
                                public_id: filename
                            });
                        };
                        newContent.videoHD = videoHD; // add the urls to object
                        console.log(videoHD)
                    }

                    if (req.files.videoFHD){
                        const videoFHD = []; // array to hold the video urls // array of videos
                        const vid2 = req.files.videoFHD
                        // if (!vid2){
                        //     return videoFHD
                        // } else {
                        for (const file of vid2) {
                        const { path, filename } = file;
                        videoFHD.push({
                            video: path,
                            public_id: filename
                        });
                    };
                    newContent.videoFHD = videoFHD; // add the urls to object
                        console.log(videoFHD)
                        }


                    if (req.files.video2k){
                        const video2k = []; // array to hold the video urls // array of videos
                        const vid3 = req.files.video2k
                        // if (!vid3){
                        //     return video2k
                        // } else {
                        for (const file of vid3) {
                        const { path, filename } = file;
                        video2k.push({
                            video: path,
                            public_id: filename
                        });
                    };
                    newContent.video2k = video2k; // add the urls to object
                        console.log(video2k)
                        }


                    if (req.files.video4k){
                        const video4k = []; // array to hold the video urls // array of videos
                        const vid4 = req.files.video4k
                        // if (!vid4){
                        //     return video4k
                        // } else {
                        for (const file of vid4) {
                        const { path, filename } = file;
                        video4k.push({
                            video: path,
                            public_id: filename
                        });
                    };
                    newContent.video4k = video4k; // add the urls to object
                        console.log(video4k)
                        }

                            const savedContent = await newContent.save()
                            console.log(savedContent)
                               res.status(200).json({message: 'success', data: savedContent})
            } catch (err) {
                console.log(err.message);
                return res.status(400).json({message: "cloudinary error", error: err.message})
            }

    // }else {
    //     res.status(500).json({message: "Server Error"})
    // }
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

router.put('/:id', SUpload.fields([{
    name: 'videoHD', maxCount: 1
  }, {
    name: 'videoFHD', maxCount: 1
  }, {
    name: 'video2k', maxCount: 1
  }, {
    name: 'video4k', maxCount: 1
  }]), async (req, res) => {
    // if you are the admin
    //  if (req.user.isAdmin) {
         try {
             // fetch the movie you want to update
             let updatedContent = await Content.findById(req.params.id) 
            //  await cloudinary.uploader.destroy(updatedContent.public_id, { resource_type: "video", 
            //  function(err, result)
            //  {console.log( err, result) }})
            //  const result = await cloudinary.uploader.upload(req.file.path, {
            //     resource_type: "video",
            //     folder: "views"
            // });

            const { 
                title, 
                description, 
                year, 
                ageLimit,
                duration,
                director,
                genre,
             } = req.body;
             console.log(updatedContent.videoHD, req.files, '$$$$££££')
            if (!req.files) {
                return updatedContent
            } else if (req.files) {
                let videoHD = []
                if(!req.files.videoHD){
                    videoHD = updatedContent.videoHD
                }else if(updatedContent.videoHD){
                    await cloudinary.api.delete_resources([updatedContent.videoHD[0].public_id], {
                        resource_type: 'video'
                    },
                        function (err, result) {console.log(result, err, 'hd')
                       })
                    const HDfiles = req.files.videoHD;
                    for (const file of HDfiles) {
                        const { path, filename } = file;
                        videoHD.push({
                            video: path,
                            public_id: filename
                        });
                    }
                    updatedContent.videoHD = videoHD
                } else {
                    const HDfiles = req.files.videoHD;
                    for (const file of HDfiles) {
                        const { path, filename } = file;
                        videoHD.push({
                            video: path,
                            public_id: filename
                        });
                    }
                    updatedContent.videoHD = videoHD
                }
                
                let videoFHD = []
                if(!req.files.videoFHD){
                    videoFHD = updatedContent.videoFHD
                }else if (updatedContent.videoFHD){
                    await cloudinary.api.delete_resources([updatedContent.videoFHD[0].public_id], {
                        resource_type: 'video'
                    },
                        function (err, result) {console.log(result, err, 'fhd')
                       })
                            const FHDfiles = req.files.videoFHD;
                            
                            for (const file of FHDfiles) {
                                const { path, filename } = file;
                                videoFHD.push({
                                    video: path,
                                    public_id: filename
                                });
                            }   
                            updatedContent.videoFHD = videoFHD
                } else {
                            const FHDfiles = req.files.videoFHD;
                            
                            for (const file of FHDfiles) {
                                const { path, filename } = file;
                                videoFHD.push({
                                    video: path,
                                    public_id: filename
                                });
                            }   
                            updatedContent.videoFHD = videoFHD
                }
                
                    
                let video2k = []
                if(!req.files.video2k){
                    video2k = updatedContent.video2k
                }else if (updatedContent.video2k){
                    await cloudinary.api.delete_resources([updatedContent.video2k[0].public_id], {
                            resource_type: 'video'
                        },
                            function (err, result) {console.log(result, err, '2k')
                           })
                        const kfiles = req.files.video2k;
                        for (const file of kfiles) {
                            const { path, filename } = file;
                            video2k.push({
                                video: path,
                                public_id: filename
                            });
                        }    
                        updatedContent.video2k = video2k   
                } else {
                    const kfiles = req.files.video2k;
                    for (const file of kfiles) {
                        const { path, filename } = file;
                        video2k.push({
                            video: path,
                            public_id: filename
                        });
                    }    
                    updatedContent.video2k = video2k   
                }
                        
                let video4k = []
                if(!req.files.video4k){
                    video4k = updatedContent.video4k
                }else if (updatedContent.video4k){
                    await cloudinary.api.delete_resources([updatedContent.video4k[0].public_id], {
                        resource_type: 'video'
                    },
                        function (err, result) {console.log(result, err, '4k')
                       })
                           const nfiles = req.files.video4k;
                           for (const file of nfiles) {
                               const { path, filename } = file;
                               video4k.push({
                                   video: path,
                                   public_id: filename
                               });
                           }  
                           updatedContent.video4k = video4k 
                } else {
                           const nfiles = req.files.video4k;
                           for (const file of nfiles) {
                               const { path, filename } = file;
                               video4k.push({
                                   video: path,
                                   public_id: filename
                               });
                           }  
                           updatedContent.video4k = video4k 
                }
                               
                            

             const data = {
                title: title || updatedContent.title,
                description: description || updatedContent.description,
                year: year || updatedContent.year,
                ageLimit: ageLimit || updatedContent.ageLimit,
                duration: duration || updatedContent.duration,
                description: description || updatedContent.description,
                director: director || updatedContent.director,
                genre: genre || updatedContent.genre,
                videoHD: videoHD || updatedContent.videoHD,
                videoFHD: videoFHD || updatedContent.videoFHD,
                video2k: video2k || updatedContent.video2k,
                video4k: video4k || updatedContent.video4k
                // public_id: result.public_id || updatedContent.public_id
             }
                // UPDATE FIRST
               updatedContent = await Content.findByIdAndUpdate(req.params.id, {
                    $set: data,
                },
                //RETURN NEW USER
                {
                    new: true
                });
                console.log(updatedContent)
             res.status(200).json({result: updatedContent});
            } else {
                try{
                    const updatedContent = await Content.findByIdAndUpdate(req.params.id,
                    
                    {$set: req.body},

                    {new: true});
                    return res.status(200).json(updatedContent)
                    } catch (err){
                        console.log(err.message)
                    }
            }
         } catch (err) {
             res.status(500).json({message: err})
             console.log(err)
         }
    //  } else {
    //      res.status(403).json(`Only admin can make changes`)
    //  }
})



//DELETE A CONTENT

// router.delete('/:id', verify, async (req, res) => {
//     // if you are the admin
//     if (req.user.isAdmin) {
//         //fetch the movie using the movie id and delete the user.
//         try {
//             let content = await Content.findById(req.params.id);
//             console.log(content.public_id)
//             await cloudinary.uploader.destroy(content.public_id, { resource_type: "video", 
//             function(err, result)
//             {console.log( err, result) }})
//             await content.remove()
//             res.status(200).json(`The Content with id ${req.params.id} has been deleted.`);
//         } catch (err) {
//             res.status(500).json(err)
//         }
//     } else {
//         //if the Content id is not the same as the one requested,
//         //then return this response 'You can only delete your account' 
//         res.status(403).json(`Only admin can make changes`)
//     }
// })


router.delete('/:id', async (req, res) => {
    // if you are the admin
    // if (req.user.isAdmin) {
        //fetch the movie using the movie id and delete the user.
        try {
            let content = await Content.findById(req.params.id);
            if(content.videoHD){
                await cloudinary.api.delete_resources([content.videoHD[0].public_id], {
                    resource_type: 'video'
                },
                     function (err, result) {console.log(result, err, 'deleted videoHD in cloudinary')
                    })
            }else if(content.videoFHD){
                    await cloudinary.api.delete_resources([content.videoFHD[0].public_id], {
                        resource_type: 'video'
                    },
                         function (err, result) {console.log(result, err, 'deleted videoFHD in cloudinary')
                        })
                }else if(content.video2k){
                        await cloudinary.api.delete_resources([content.video2k[0].public_id], {
                            resource_type: 'video'
                        },
                             function (err, result) {console.log(result, err, 'deleted video2k in cloudinary')
                            })
                    }else if(content.video4k){
                            await cloudinary.api.delete_resources([content.video4k[0].public_id], {
                            resource_type: 'video'
                        },
                             function (err, result) {console.log(result, err, 'deleted video4k in cloudinary')
                            })
                        } else {
                            return content
                        }
                        
            await Content.findByIdAndDelete(req.params.id)
            res.status(200).json({message: `The Content with id ${req.params.id} has been deleted.`, deleted: content});
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     //if the Content id is not the same as the one requested,
    //     //then return this response 'You can only delete your account' 
    //     res.status(403).json(`Only admin can make changes`)
    // }
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

router.get('/', async (req, res) => {
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

import express from 'express'
import Content from '../models/Content.js';
const router = express.Router();
import Movie from '../models/Movie.js';
import cloudinary from '../utils/cloudinary.js';
// import Upload from '../utils/multer.js';
import { storage, SUpload } from '../utils/cloud.js';
// import cloudinary from '../utils/cloud.js';
import verify from '../verifyToken.js'


//CREATE A MOVIE

router.post('/',
//  SUpload.array('image'), 
 SUpload.fields([{
    name: 'image', maxCount: 1
  }, {
    name: 'thumbnail', maxCount: 1
  }, {
    name: 'trailer', maxCount: 1
  }]),
 verify, async (req, res) => {

    

    console.log(req.body, 'the list of requests')

    const { 
        title, 
        description, 
        year, 
        ageLimit,
        duration,
        director,
        genre,
        isSeries,
        content
     } = req.body;

    if (req.user.isAdmin) {
            try {
                if (!req.files){
                    console.log(req.file, 'files');
                    const error = new Error('No File')
                    console.log(error)
                    return res.status(400).json({message: "We need a file"});
                }


            // const result = await cloudinary.uploader.upload(req.file.path, 
            //     {
            //         resource_type: "auto",
            //         folder: "views"
            //     })
                
                let newMovie = new Movie({
                    title, 
                    description, 
                    year, 
                    ageLimit,
                    duration,
                    director,
                    genre,
                    isSeries,
                    content, 
                    // image: result.secure_url,
                    // public_id: result.public_id,
                });

                if (req.files) { // if you are adding multiple files at a go
                    const image = []; // array to hold the image urls
                    const files = req.files.image; // array of images
                    for (const file of files) {
                        const { path, filename } = file;
                        image.push({
                            image: path,
                            public_id: filename
                        });
                    };
                    

                    const thumbnail = []; // array to hold the thumbnail urls // array of thumbnails
                    const pic = req.files.thumbnail
                    for (const file of pic) {
                        const { path, filename } = file;
                        thumbnail.push({
                            thumbnail: path,
                            public_id: filename
                        });
                    };

                    
                    const trailer = []; // array to hold the thumbnail urls // array of thumbnails
                    const tra = req.files.thumbnail
                    for (const file of tra) {
                        const { path, filename } = file;
                        trailer.push({
                            trailer: path,
                            public_id: filename
                        });
                    };


                // console.log(req.files.thumbnail, 'pppppppppp')
                // console.log(req.files.image, 'YYYYYYYY')
                    

                    // const public_id = []; // array to hold the image urls
                    // const pid = req.files; // array of images
                    // for (const file of pid) {
                    //     const { filename } = file;
                    //     public_id.push(filename);
                    // };

                    // console.log(files)
                    // console.log(image)
                    
        
                    newMovie.image = image; // add the urls to object
                    newMovie.thumbnail = thumbnail
                    newMovie.trailer = trailer

                    // const reduce = par => {
                    //     return par.reduce((acc, str) => {
                    //         let char = str.charAt(0).toLowerCase();
                    //         acc[char] = acc[char] || [];
                    //         acc[char].push(str.toLowerCase());
                    //         return acc
                    //     }, {})
                    // }

                    // console.log(reduce(image))
                }
                    const savedMovie = await newMovie.save();
                    return res.status(201).json({ savedMovie });
        

                // const result = await cloudinary.uploader.upload(req.file.path, {
                //     resource_type: "auto",
                //     folder: "views"
                // })
                // let newMovie = new Movie({
                //             title: req.body.title,
                //             description: req.body.description,
                //             year: req.body.year,
                //             ageLimit: req.body.ageLimit,
                //             duration: req.body.duration,
                //             director: req.body.director,
                //             genre: req.body.genre,
                //             image: [],
                //             isSeries: req.body.isSeries,
                //             content: req.body.content,
                //             public_id: result.public_id
                //         });



                // const savedMovie = await newMovie.save()
                // return res.status(200).json({message: 'success', data: savedMovie})
            } catch (err) {
                console.log(err);
                return res.status(400).json({message: "cloudinary error", error: err.message})
            }
        } else {
            res.status(500).json({message: "Server Error"})
        }
});


// router.post('/', SUpload.single('image'), verify, async (req, res) => {
// try {
//     if (!req.file){
//         res.status(400).json({message: "We need a file"});
//     }
//         try {
//             const result = await cloudinary.uploader.upload(req.file.path, {
//                 resource_type: "auto"
//             })
//             let newMovie = new Movie({
//                         // name: req.body.name,
//                         image: result.secure_url,
//                         public_id: result.public_id
//                     });
//                            await newMovie.save()
//                            res.json(newMovie)
//         } catch (err) {
//             console.log(err.message);
//             res.status(400).json({message: "cloudinary error"})
//         }

// } catch (err) {
//     console.log(err.message);
//     res.status(500).json({message: "Server Error"})
// }
// })





router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin){
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,

                // UPDATE FIRST
                {$set: req.body},
                
                //RETURN NEW USER
                {new: true});
                return res.status(200).json(updatedMovie)
        } catch (err) {
            console.log(err.message)
        }
    } else {
        res.status(403).json(`Only Admin can make changes`)
    }
})




//UPDATE A MOVIE

router.put('/:id',
//  SUpload.array('image'), 
 SUpload.fields([{
    name: 'image', maxCount: 1
  }, {
    name: 'thumbnail', maxCount: 1
  }, {
    name: 'trailer', maxCount: 1
  }]),
 verify, async (req, res) => {
    // if you are the admin
     if (req.user.isAdmin) {
         try {
             // fetch the movie you want to update
             let updatedMovie = await Movie.findById(req.params.id)

            if (req.files) {
             await cloudinary.uploader.destroy(updatedMovie.image[0].public_id,
             {
                 invalidate: true
             }, 
             function(error, result) {
                 console.log(result, error)
             })
             await cloudinary.uploader.destroy(updatedMovie.thumbnail[0].public_id,
                {
                    invalidate: true
                }, 
                function(error, result) {
                    console.log(result, error)
                })
                await cloudinary.uploader.destroy(updatedMovie.trailer[0].public_id,
                    {
                        invalidate: true
                    }, 
                    function(error, result) {
                        console.log(result, error)
                    })
             

             const data = {
                title: req.body.title || updatedMovie.title,
                description: req.body.description || updatedMovie.description,
                year: req.body.year || updatedMovie.year,
                ageLimit: req.body.ageLimit || updatedMovie.ageLimit,
                description: req.body.description || updatedMovie.description,
                duration: req.body.duration || updatedMovie.duration,
                director: req.body.director || updatedMovie.director,
                genre: req.body.genre || updatedMovie.genre,
                isSeries: req.body.isSeries || updatedMovie.isSeries,
                content: req.body.content || updatedMovie.content,
                // public_id: result.public_id || updatedMovie.public_id
             }


                const image = []; // array to hold the image urls
                const files = req.files.image; // array of images
                for (const file of files) {
                    const { path, filename } = file;
                    image.push({
                        image: path,
                        public_id: filename
                    });
                };

                console.log(image)

                    const thumbnail = []; // array to hold the thumbnail urls // array of thumbnails
                    const pic = req.files.thumbnail
                    for (const file of pic) {
                        const { path, filename } = file;
                        thumbnail.push({
                            thumbnail: path,
                            public_id: filename
                        });
                    };


                    const trailer = []; // array to hold the thumbnail urls // array of thumbnails
                    const tra = req.files.thumbnail
                    for (const file of tra) {
                        const { path, filename } = file;
                        trailer.push({
                            trailer: path,
                            public_id: filename
                        });
                    };
            
             updatedMovie.image = image
             updatedMovie.thumbnail = thumbnail
             updatedMovie.trailer = trailer

             

                // UPDATE FIRST
               updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                   $set: data,
                },
                //RETURN NEW USER
                {
                    new: true
                });
                console.log(updatedMovie)
             return res.status(200).json({result: updatedMovie});
            } else {
                try {
                    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
        
                        // UPDATE FIRST
                        {$set: req.body},
                        
                        //RETURN NEW USER
                        {new: true});
                        return res.status(200).json(updatedMovie)
                } catch (err) {
                    console.log(err.message)
                }
            }
         } catch (err) {
             res.status(500).json({message: err})
         }
     } else {
         res.status(403).json(`Only admin can make changes`)
     }
})



//DELETE A MOVIE

// router.delete('/:id', verify, async (req, res) => {
//     // if you are the admin
//     if (req.user.isAdmin) {
//         //fetch the movie using the movie id and delete the user.
//         try {
//             await Movie.findByIdAndDelete(req.params.id);
//             res.status(200).json(`The movie with id ${req.params.id} has been deleted.`);
//         } catch (err) {
//             return res.status(500).json(err)
//         }
//     } else {
//         //if the movie id is not the same as the one requested,
//         //then return this response 'You can only delete your account' 
//         res.status(403).json(`Only admin can make changes`)
//     }
// })

router.delete('/:id', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        //fetch the movie using the movie id and delete the user.
        try {
            let movie = await Movie.findById(req.params.id);
            await cloudinary.uploader.destroy(movie.image[0].public_id,
                {
                    invalidate: true
                }, 
                function(error, result) {
                    console.log(result, error)
                })
                await cloudinary.uploader.destroy(movie.thumbnail[0].public_id,
                   {
                       invalidate: true
                   }, 
                   function(error, result) {
                       console.log(result, error)
                   })
                   await cloudinary.uploader.destroy(movie.trailer[0].public_id,
                       {
                           invalidate: true
                       }, 
                       function(error, result) {
                           console.log(result, error)
                       })
            await Movie.findByIdAndDelete(req.params.id)
            res.status(200).json(`The Movie with id ${req.params.id} has been deleted.`, {deleted: movie});
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if the Content id is not the same as the one requested,
        //then return this response 'You can only delete your account' 
        res.status(403).json(`Only admin can make changes`)
    }
})



//GET A MOVIE

router.get('/find/:id', async (req, res) => {
    //fetch the movie using the movie id.
        try {
            const movie = await Movie.findById(req.params.id);

            //return the movie 
            res.status(200).json(movie);
        } catch (err) {
            //catch any errors.
           return res.status(500).json(err)
        }
})

//GET A RANDOM MOVIE

// router.get('/random', verify, async (req, res) => {
//     // name the query "type"
//     const type = req.query.type;
//     let movie;

//         try {
//             //if the query type is series
//             if (type === 'series'){
//                 // fetch one
//                 return movie = await Movie.aggregate([
//                     { 
//                         $match: { isSeries: true },
//                     },
//                     {
//                         $sample: { size: 1 }
//                     }
//                 ]);
//             } else {
//                 // else fetch a movie
//                  movie = await Movie.aggregate([
//                     { 
//                         $match: { isSeries: false },
//                     },
//                     {
//                         $sample: { size: 1 }
//                     }
//                 ]);
//             }
//             res.status(200).json({message: 'success', movie})
//         } catch (err) {
//              console.log(err)
//         }
// })


router.get('/random', verify, async (req, res) => {
    const type = req.query.type
    let movie;
    try {
        if (type === 'series'){
            movie = await Movie.aggregate([
                {$match: {isSeries: true} },
                {$sample: {size: 1} },
            ]);
        } else {
            movie = await Movie.aggregate([
                {$match: {isSeries: false} },
                {$sample: {size: 1} },
            ]);
        }
        res.status(200).json(movie)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET RANDOM MOVIES --- FEATURED

router.get('/featured', verify, async (req, res) => {
    // name the query "type"
    let movie;
        try {
                // fetch random one
                movie = await Movie.aggregate([
                    {
                        $sample: { size: 10 }
                    }
                ]);
            res.status(200).json(movie)
        } catch (err) {
            res.status(500).json(err)
        }
})


//GET USER STATS

router.get('/stats', async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear - 1)

    const monthsArray = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

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


//GET ALL MOVIES



router.get('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse())
        } catch (err) {
            res.status(500).json(err.message)
        }
    } else {
        res.status(403).json(`Only admin can make changes`)
    }
})


export default router
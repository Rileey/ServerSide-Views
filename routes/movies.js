import e from 'express';
import express from 'express'
const router = express.Router();
import Movie from '../models/Movie.js';

import verify from '../verifyToken.js'


//CREATE A MOVIE
 
router.post('/', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        // insert new movie.
        const newMovie = new Movie(req.body)

        try {
            // try saving the new movie
            const savedMovie = await newMovie.save();
            // if the movie has been saved return said movie.
            res.status(200).json({success: true, data: savedMovie})
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json(`Only admin can make changes`)
    }
})


//UPDATE A MOVIE

router.put('/:id', verify, async (req, res) => {
    // if you are the admin
     if (req.user.isAdmin) {
         try {
             // fetch the movie you want to update
             const updatedMovie = await Movie.findOneAndUpdate(req.params.id, 
                
                // UPDATE FIRST
                {$set: req.body},
                
                //RETURN NEW USER
                {
                    new: true
                });
             res.status(200).json(updatedMovie);
         } catch (err) {
             res.status(500).json(err)
         }
     } else {
         res.status(403).json(`Only admin can make changes`)
     }
})



//DELETE A MOVIE

router.delete('/:id', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        //fetch the movie using the movie id and delete the user.
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json(`The movie with id ${req.params.id} has been deleted.`);
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if the movie id is not the same as the one requested,
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
            res.status(500).json(err)
        }
})

//GET A RANDOM MOVIE

router.get('/random', verify, async (req, res) => {
    // name the query "type"
    const type = req.query.type;
    let movie;
        try {
            //if the query type is series
            if (type === 'series'){
                // fetch one
                movie = await Movie.aggregate([
                    { 
                        $match: { isSeries: true },
                    },
                    {
                        $sample: { size: 1 }
                    }
                ]);
            } else {
                // else fetch a movie
                movie = await Movie.aggregate([
                    { 
                        $match: { isSeries: false },
                    },
                    {
                        $sample: { size: 1 }
                    }
                ]);
            }
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
    // if you are the admin
    if (req.user.isAdmin) {
        //fetch the movie using the movie id and delete the user.
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());  //.reverse sends the movies in from the last one created.
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if user is not admin, return: 'only admin can make changes' 
        res.status(403).json(`Only admin can make changes`)
    }
})


export default router
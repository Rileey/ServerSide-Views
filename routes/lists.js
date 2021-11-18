import express from 'express'
const router = express.Router();
import List from '../models/List.js';

import verify from '../verifyToken.js'


//CREATE A MOVIE-LIST
 
router.post('/', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        // insert new list.
        const newList = new List(req.body)

        try {
            // try saving the new list
            const savedList = await newList.save();
            // if the list has been saved return said list.
            res.status(200).json({success: true, data: savedList})
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json(`Only admin can make changes`)
    }
})




//DELETE A MOVIE-LIST
 
router.delete('/:id ', verify, async (req, res) => {
    // if you are the admin
    if (req.user.isAdmin) {
        try {
            // fetch a list using it's id
            await List.findByIdAndDelete(req.params.id);
            // if the list has been deleted, display the message 'the list with id ------ has been deleted'.
            res.status(200).json({success: true, message: `the list with the id ${req.params.id} has been deleted`})
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        // else return "only admin can make changes"
        res.status(403).json(`Only admin can make changes`)
    }
})



// GET MOVIE-LIST 

router.get('/', verify, async (req, res) => {
    // assign a type and genre query
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;

    let list =  [];

    try {
        // if the type && genre of content are selected
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    {
                        $sample: {
                            size: 10
                        }
                },
                {
                    $match: {
                        // return the selected list of content, by type and genre
                        type: typeQuery,
                        genre: genreQuery
                    }  
                },
            ]); 
            } else {
                list = await List.aggregate([
                    {
                        $sample: {
                            size: 10
                        },
                },
                {
                    $match: {
                        // return the selected list of content by type only.
                        type: typeQuery
                    }  
                }
                ])
            }

        } else {
            // else return all the lists of content.
            list = await List.aggregate([{
                $sample: {
                    size: 10
                }
            }]); 
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err)
    }
})




export default router
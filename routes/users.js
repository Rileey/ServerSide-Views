import express from 'express'
const router = express.Router();
import User from '../models/User.js';
import CryptoJS from 'crypto-js';
import verify from '../verifyToken.js'


//UPDATE

router.put('/:id', verify, async (req, res) => {
    // if the your user id is the same as the the one you are requesting or you are the admin
     if (req.user.id === req.params.id || req.user.isAdmin) {
         //if the inputed password is the same, encrypt it
         if (req.body.password) {
             req.body.password = CryptoJS.AES.encrypt(
                 req.body.password,
                 process.env.SECRET_KEY
             ).toString();
         }
         //then fetch the user, using the user id.
         try {
             const updatedUser = await User.findOneAndUpdate(req.params.id, 
                
                // UPDATE FIRST
                {$set: req.body},
                
                //RETURN NEW USER
                {
                    new: true
                });
             res.status(200).json(updatedUser);
         } catch (err) {
             res.status(500).json(err)
         }
     } else {
         res.status(403).json(`You can update only your account`)
     }
})



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

//GET ALL

router.get('/', verify, async (req, res) => {
    const query = req.query.new;
    // if you are the admin
    if (req.user.isAdmin) {
        //get the user using the user id and delete the user.
        try {
            //fetch the last ten users if there is a query, if not fetch all users excluding you
            const users = query ? await User.find().sort({_id: -1}).limit(10) : await User.find()
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        //if you are not the admin,
        //then return this response 'Access to users denied '
        res.status(403).json(`Access to users denied!`)
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


export default router
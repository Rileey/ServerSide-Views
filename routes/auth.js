import express from 'express'
const router = express.Router();

import User from '../models/User.js'
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken'; 

 //REGISTER
 router.post("/register", async (req, res) => {
      const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
      });

    // const { username, email, password} = req.body;

    // const user = new User({
    //     username,
    //     email,
    //     password
    // })

    // user.save().then((newUser) => {
    //     res.status(200).json({
    //         suceess: true,
    //         data: newUser
    //     });
    // }).catch((err) => {
    //     res.status(500).json({
    //         message: err,
    //     })
    // })
    console.log(req.body)

    try {
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
 })


 //LOGIN

 router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json('Wrong password or username!');

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
        res.status(401).json('Wrong password or username!')

            const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin},
                process.env.SECRET_KEY, { expiresIn: '5d' })

        // seperate the password from the rest of the data.
        const { password, ...info} = user._doc;

        // return the document information (info) but leaving out the password
        res.status(200).json({...info, accessToken})
    } catch (err) {
        res.status(500).json(err)
    }
 })

export default router
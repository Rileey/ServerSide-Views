import express from 'express'
const router = express.Router();

import User from '../models/User.js'
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken'; 

 //REGISTER
 router.post("/register", async (req, res) => {
    try {
        const { phoneNumber, email, password, confirmPassword } = req.body

            if(!phoneNumber || !email || !password || !confirmPassword) {
                return res
                .status(400)
                .json({message: 'All fields must be provided'})
            }

            if(confirmPassword !== password){
                return res.status(400).json({message: 'Password Incorrect'})
            }
           const newUser = new User({
            phoneNumber: phoneNumber,
            email: email,
            password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(),
            confirmPassword: CryptoJS.AES.encrypt(confirmPassword, process.env.SECRET_KEY).toString()
        });

        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
 })


 //LOGIN

 router.post('/login', async (req, res, next) => {

    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.json('Wrong password or email!');

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

       if ( originalPassword !== req.body.password ) {
        return res.status(401).json('Wrong password or email!')
    }
            const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin},
                process.env.SECRET_KEY, { expiresIn: '30d' })

        // seperate the password from the rest of the data.
        const { password, ...info} = user._doc;

        // return the document information (info) but leaving out the password
        res.status(200).send({...info, accessToken})
        res.end()
    } catch (err) {
        res.json(err.message)
    }
 })

export default router
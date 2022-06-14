import emailValidation from '../utils/validateEmail.js';
import User from '../models/User.js'
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken'; 
import express from 'express'
const router = express.Router();

 //REGISTER
 router.post("/register", async (req, res) => {
    try {
        const { username, phoneNumber, email, password, confirmPassword } = req.body

            if(!phoneNumber || !username || !email || !password || !confirmPassword) {
                return res
                .status(400)
                .json({message: 'All fields must be provided'})
            }

            if(!emailValidation(email)) {
                return res.status(400).json({message: 'Enter a valid email address'})
            }

            const findUser = await User.findOne({email})

            if(findUser) {
                return res.status(400).json({message: 'User already exist. Please login'})
            }

            if(confirmPassword !== password){
                return res.status(400).json({message: 'Password Incorrect'})
            }
           const newUser = new User({
            username: username,
            phoneNumber: phoneNumber,
            email: email,
            password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(),
            confirmPassword: CryptoJS.AES.encrypt(confirmPassword, process.env.SECRET_KEY).toString()
        });

        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
        res.end()
        console.log(err)
    }
 })


 //LOGIN

 router.post('/login', async (req, res) => {
    try {
    const { email } = req.body

    console.log("non working email:",email)

    

        if (!email || !req.body.password){
            return res.status(400).json({message: 'All fields must be provided'})
        }


        const user = await User.findOne({email})
        if ( !user ){
            return res.status(401).json({message: 'Wrong password or email!'});
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if ( user ){
            if ( originalPassword !== req.body.password ) {
            return res.status(401).json({message: 'Wrong email or password!'})
            }  
        }
            const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin},
                process.env.SECRET_KEY, { expiresIn: '60' })

        // seperate the password from the rest of the data.
        const { confirmPassword, password, ...info} = user._doc;
        console.log(user._doc)

        // return the document information (info) but leaving out the password
        return res.status(200).json({...info, accessToken})
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
        res.end()
    }
 })

export default router
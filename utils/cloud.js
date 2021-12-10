
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import multer from 'multer';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "views",
        resource_type: "auto",
        public_id: (req, file) => {
            console.log(
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            );
            return (
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            );
            
        },
    },
   
});




// import path from 'path';



// const videoStorage =  multer.diskStorage({ 
//     destination: 'content',
//     filename: (req, file, cb) => {
//         cb (null, file.fieldname + '_' + Date.now()
//         + path.extname(file.originalname))
//     }
// });

export const SUpload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 90000000 //90mb
    // },
})



export default cloudinary;
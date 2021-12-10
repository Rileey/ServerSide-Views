import multer from 'multer';
import path from 'path';



const videoStorage =  multer.diskStorage({ 
    destination: 'content',
    filename: (req, file, cb) => {
        cb (null, file.fieldname + '_' + Date.now()
        + path.extname(file.originalname))
    }
});

const Upload = multer({
    storage: videoStorage,
    fileFilter: (req, file, cb) => {
        // let ext = path.extname(file.originalname);
        if (!file.originalname.match(/\.(png|jpg|jpeg|mp4|MPEG-4|mkv|mov)$/)) {
            return cb(new Error("File type is not supported"));
        }
        cb(undefined, true);
    }
})

export default Upload;

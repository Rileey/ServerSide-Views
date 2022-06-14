import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.js'
import userRoute from './routes/users.js'
import movieRoute from './routes/movies.js'
import listRoute from './routes/lists.js'
import contentRoute from './routes/content.js'
import postRoute from './routes/post.js'
import commentRoute from './routes/comment.js'
import profileRoute from './routes/profile.js'
import fs from 'fs'

fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false
}));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log(`Dababase connection Successful`))
.catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute)
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api/content", contentRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/profile", profileRoute);

app.get('/', (req, res)=> {
    res.send('it is working')
})



app.listen(8800, () => {
    console.log(`Server is running on port 8800`);
});
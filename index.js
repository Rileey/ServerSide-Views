import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js'
import userRoute from './routes/users.js'

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log(`Dababase connection Successful`))
.catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute)

app.get('/', (req, res)=> {
    res.send('I am a clown')
})



app.listen(8800, () => {
    console.log(`Server is running on port 8800`);
});
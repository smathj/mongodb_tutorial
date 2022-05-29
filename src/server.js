const { ObjectId } = require('bson');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { userRouter } = require('./routes/userRouter');
const { blogRouter } = require('./routes/blogRouter');
const dotenv = require('dotenv');
dotenv.config();

const server = async () => {
  try {
    let mongodbConnection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    mongoose.set('debug', true); // 몽구스 디버깅 모드
    console.log('MongoDB Connected');

    // request body데이터의 json데이터를 가져오기위해서 ( 옛날의 bodyParser임 )
    app.use(express.json());

    // Routers
    app.use('/user', userRouter); // - UserRouter
    app.use('/blog', blogRouter); // - BlogRouter

    // Port
    app.listen(process.env.PORT, () => {
      console.log('server listening on port 3000, link = http://localhost:3000');
    });
  } catch (err) {
    console.log(err);
  }
};

server().then().catch();

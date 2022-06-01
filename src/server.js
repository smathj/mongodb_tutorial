const { ObjectId } = require('bson');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const { userRouter } = require('./routes/userRouter');
// const { blogRouter } = require('./routes/blogRouter');
const { userRouter, blogRouter } = require('./routes');
const dotenv = require('dotenv');
const { generateFakeData } = require('../faker2');
dotenv.config();

const server = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required!');
    if (!process.env.PORT) throw new Error('PORT is required!');

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    // mongoose.set('debug', true); // 몽구스 디버깅 모드
    // await generateFakeData(100, 10, 300); // faker 1
    console.log('MongoDB Connected');

    // request body데이터의 json데이터를 가져오기위해서 ( 옛날의 bodyParser임 )
    app.use(express.json());

    // Routers
    app.use('/user', userRouter); // - UserRouter
    app.use('/blog', blogRouter); // - BlogRouter

    // Port
    app.listen(process.env.PORT, async () => {
      console.log(
        'server listening on port 3000, link = http://localhost:3000'
      );
      // console.time('insert time: ');
      // await generateFakeData(1000000, 5, 20); // faker 1,2
      // await generateFakeData(10, 2, 10); // faker 1,2
      // await generateFakeData(10, 10, 10); // faker 1,2
      // console.timeEnd('insert time: ');
    });
  } catch (err) {
    console.log(err);
  }
};

server().then().catch();

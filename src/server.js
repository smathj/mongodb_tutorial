const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User'); // 모델(컬렉션 접근 db.users.xxx)

const users = [];

const MONGO_URI =
  'mongodb+srv://root:1234@mongodbtutorial.xphjlls.mongodb.net/?retryWrites=true&w=majority';

const server = async () => {
  try {
    let mongodbConnection = await mongoose.connect(MONGO_URI, {
      dbName: 'BlogService',
    });
    console.log('MongoDB Connected');

    // request body데이터의 json데이터를 가져오기위해서 ( 옛날의 bodyParser임 )
    app.use(express.json());

    app.post('/user', (req, res) => {
      let user = req.body;
      users.push({ user });
      console.log(user);
      return res.send({ success: true });
    });

    app.get('/user', (req, res) => {
      return res.send({ users });
    });

    app.listen(3000, () => {
      console.log(
        'server listening on port 3000, link = http://localhost:3000'
      );
    });
  } catch (err) {
    console.log(err);
  }
};

server().then().catch();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User'); // 모델(컬렉션 접근 db.users.xxx)

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

    // ! [Get] /user
    app.get('/user', async (req, res) => {
      try {
        const users = await User.find();
        return res.send({ users });
      } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
      }
    });

    // ! [Post] /user
    app.post('/user', async (req, res) => {
      try {
        let { username, name } = req.body;
        if (!username)
          return res.status(400).send({ err: 'username is required' });
        if (!name || !name.first || !name.last)
          return res
            .status(400)
            .send({ err: 'Both first and last names are required' });
        const user = new User(req.body);
        console.log(user);
        await user.save();
        return res.send({ user });
      } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
      }
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

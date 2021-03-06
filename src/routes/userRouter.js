const { Router } = require('express');
const userRouter = Router();
// const { User } = require('../models/User'); // 모델(컬렉션 접근 db.users.xxx)
const { User, Blog, Comment } = require('../models'); // 모델(컬렉션 접근 db.users.xxx)
const mongoose = require('mongoose');

// ! [Get] /user
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// ! [Get] /user:id
userRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ err: 'Invalid userId' });
    }
    const user = await User.findOne({ _id: userId });
    // const user = await User.findOne({ _id: ObjectId(userId) }); // 이렇게도 사용할 수 있음
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// ! [Delete] /user:id
userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ err: 'Invalid userId' });
    }
    // const user = await User.findOneAndDelete({ _id: userId });
    // const user = await User.findOne({ _id: ObjectId(userId) }); // 이렇게도 사용할 수 있음

    const [user] = await Promise.all([
      // 사용자 삭제
      User.findOneAndDelete({ _id: userId }),
      // 해당유저가 여러 Blog에다 작성한 comment 배열에서 빼버리기(삭제)
      Blog.deleteMany({ 'user._id': userId }),
      // 해당유저가 작성한 Blog들 전체 삭제
      Blog.updateMany(
        { '$comments.user': userId }, // comment라는 배열에 user라는 프로퍼티의 값이 userId인 것을 대상으로
        { $pull: { comments: { user: userId } } } // comments의 배열에서 user가 userId와 같은것을 제거한다
      ),
      // 해당유저가 작성한 Blog들 전체 삭제
      Comment.deleteMany({ user: userId }),
    ]);

    return res.send({ user }); // 삭제된 user 확인하기위해서 findOneAndDelete
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// ! [Update] /user:id
userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ err: 'Invalid userId' });
    }
    const { age, name } = req.body;
    // validation check
    if (!age && !name) {
      return res.status(400).send({ err: 'age or name is required' });
    }
    if (age && typeof age !== 'number') {
      return res.status(400).send({ err: 'age must be a number' });
    }
    if (
      name &&
      typeof name.first !== 'string' &&
      typeof name.last !== 'string'
    ) {
      return res.status(400).send({ err: 'first and last name are strings' });
    }
    // v1.
    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;

    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   // { $set: { age } }, // { age } 로 $set 없어도됨
    //   updateBody,
    //   { new: true }
    // );

    // v2. 몽구스 스키마 체크 하도록
    let user = await User.findById(userId); // user 찾기
    console.log({ userBeforeEdit: user });
    if (age) user.age = age;
    if (name) {
      // user의 name 수정
      user.name = name;
      Promise.all([
        // user의 name 수정
        Blog.updateMany({ 'user._id': userId }, { 'user.name': name }),
        // Blog에서 comments 배열안에있는ㄴ user의 userFullName 수정
        Blog.updateMany(
          {},
          { 'comments.$[comment].userFullName': `${name.first} ${name.last}` },
          {
            arrayFilters: [{ 'comment.user': userId }], // [필터링] 이거에 해당하는것만 유저풀네임 바꿔주세요
          }
        ),
      ]);
    }
    console.log({ userAfterEdit: user });
    await user.save(); // users.updateOne 이 호출

    return res.send({ user }); // 수정된 user 확인하기위해서 findOneAndDelete
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// ! [Post] /user
userRouter.post('/', async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username) return res.status(400).send({ err: 'username is required' });
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

module.exports = { userRouter };

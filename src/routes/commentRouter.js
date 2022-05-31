const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const commentRouter = Router({ mergeParams: true }); // 앞부분 경로변수를 가져오기 위해서
const { Comment } = require('../models/Comment');
// const { Blog } = require('../models/Blog');
// const { User } = require('../models/User');
const { Blog, User } = require('../models');

//! Comment 생성
commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    // 필수값 체크
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'blogId is invalid' });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'userId is invalid' });
    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' });

    const [blog, user] = await Promise.all([
      await Blog.findById(blogId),
      await User.findById(userId),
    ]);
    // const blog = await Blog.findById(blogId);
    // const user = await User.findById(userId);
    if (!blog || !user)
      return res.status(400).send({ err: 'blog or user does not exist' });
    if (!blog.islive)
      return res.status(400).send({ err: 'blog is not available' });

    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`, // v2. userFullName 추가
      blog,
    });
    // v1.
    // await comment.save();

    // v2. blog 컬렉션의 comments 필드에도 푸쉬해주고, comment 컬렉션 자체에도 저장한다 ( 2번 저장 하긴 함 )
    Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);

    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

//! Comment 조회
commentRouter.get('/', async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ err: 'blogId is invalid' });

  const comments = await Comment.find({ blog: blogId });
  return res.send({ comments });
});

/**
 * ! Comment 수정
 * Comment  자체 수정 후 Blog의 comments 배열에도 똑같이 수정해준다
 */
commentRouter.patch('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (typeof content !== 'string')
    return res.status(400).send({ err: 'content is required' });

  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    // comments 배열안에 _id를 갖은 객체
    Blog.updateOne(
      { 'comments._id': commentId },
      { 'comments.$.content': content } // 조건(_id)에 만족하는 인덱스를  $ 로 가리킨다
    ),
  ]);

  return res.send({ comment });
});

/**
 * ! Comment 삭제
 */
commentRouter.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });
  // Blog에있는 comments 배열에있는 comment 삭제 해야함
  await Blog.updateOne(
    { '$comments._id': commentId }, // 조건(블로그에서 comments 배열에서 조건을 만족하는 특정 comment)
    { $pull: { comments: { _id: commentId } } } // 꺼내는 타켓 ( 배열을 꺼낸다(삭제))
    // { $pull: { comments: $eleMath{ content: "hello", state: true} } } // 동시 조건을충족 해야할때 $eleMath 사용
  );
  return res.send({ comment });
});

module.exports = { commentRouter };

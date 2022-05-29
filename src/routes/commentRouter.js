const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const commentRouter = Router({ mergeParams: true }); // 앞부분 경로변수를 가져오기 위해서
const { Comment } = require('../models/Comment');
// const { Blog } = require('../models/Blog');
// const { User } = require('../models/User');
const { Blog, User } = require('../models');

commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: 'blogId is invalid' });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ err: 'userId is invalid' });
    }
    if (typeof content !== 'string') {
      return res.status(400).send({ err: 'content is required' });
    }

    const [blog, user] = await Promise.all([await Blog.findById(blogId), await User.findById(userId)]);
    // const blog = await Blog.findById(blogId);
    // const user = await User.findById(userId);
    if (!blog || !user) {
      return res.status(400).send({ err: 'blog or user does not exist' });
    }
    if (!blog.islive) {
      return res.status(400).send({ err: 'blog is not available' });
    }

    const comment = new Comment({ content, user, blog });
    await comment.save();
    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

commentRouter.get('/', async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    return res.status(400).send({ err: 'blogId is invalid' });
  }

  const comments = await Comment.find({ blog: blogId });
  return res.send({ comments });
});

module.exports = { commentRouter };

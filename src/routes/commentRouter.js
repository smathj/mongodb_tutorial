const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { Blog } = require('../models/Blog');
const commentRouter = Router({ mergeParams: true }); // 앞부분 경로변수를 가져오기 위해서
const { Comment } = require('../models/Comment');
const { User } = require('../models/User');

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

    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);
    if (!blog || !user) {
      return res.status(400).send({ err: 'blog or user does not exist' });
    }
    if (!blog.islive) {
      return res.status(400).send({ err: 'blog is not available' });
    }

    const comment = new Comment({ content, user, blog });
    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

commentRouter.get('/', async (req, res) => {});

module.exports = { commentRouter };

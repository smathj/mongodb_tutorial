const { Router } = require('express');
const blogRouter = Router();
const { Blog } = require('../models/Blog'); // Model

// [Post]
blogRouter.post('/', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// [Get] 전체 조회
blogRouter.get('/', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// [put] 상세 조회
blogRouter.get('/:blogId', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// [put] 전체 수정
blogRouter.put('/:blogId', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// [patch] 특정 부분 수정
blogRouter.patch('/:blogId', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = { Blog };

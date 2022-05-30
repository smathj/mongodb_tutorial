console.log('client code running');
const axios = require('axios');

const URI = 'http://localhost:3000';

const test = async () => {
  // 블로그 리스트 조회
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      // 블로그 작성한 사용자로, 사용자 조회
      //   const res1 = await axios.get(`${URI}/user/${blog.user}`);
      // 블로그 아이디로, 블로그에 달린 댓글 조회
      //   const res2 = await axios.get(`${URI}/blog/${blog._id}/comment`);

      // 블로그 작성자, 댓글 조회
      const [res1, res2] = await Promise.all([axios.get(`${URI}/user/${blog.user}`), axios.get(`${URI}/blog/${blog._id}/comment`)]);
      blog.user = res1.data.user;
      // 블로그에 댓글단 사람들 조회
      blog.comments = await Promise.all(
        res2.data.comments.map(async (comment) => {
          const {
            data: { user },
          } = await axios.get(`${URI}/user/${comment.user}`);
          comment.user = user;
          return comment;
        })
      );
      return blog;
    })
  );
  //   console.log(blogs);
  console.dir(blogs[0], { depth: 10 });
};

test();

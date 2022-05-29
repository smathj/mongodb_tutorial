const express = require('express');
const app = express();

const users = [];

// request body데이터의 json데이터를 가져오기위해서
app.use(express.json());

app.get('/user', (req, res) => {
  return res.send({ users });
});

app.post('/user', (req, res) => {
  users.push({ name: req.body.name, age: req.body.age });
  return res.send({ success: true });
});

app.listen(3000, () => {
  console.log('server listening on port 3000, link = http://localhost:3000');
});

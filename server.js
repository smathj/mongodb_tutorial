const express = require('express');
const app = express();

const users = [];

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
  console.log('server listening on port 3000, link = http://localhost:3000');
});

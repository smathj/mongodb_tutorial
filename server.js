const express = require('express');
const app = express();

app.get('/', (req, res) => {
  return res.send('Hello world');
});

app.listen(3000, () => {
  console.log('server listening on port 3000, link = http://localhost:3000');
});

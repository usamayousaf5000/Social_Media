const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'abcdeghijk';

const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    id: 1,
    email: 'superadmin@example.com',
    password: 'superadmin',
    role: 'superadmin',
    posts: []
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'admin',
    role: 'admin',
    posts: [
      { id: 1, content: "Admin's post1", likes: [], comments: [] },
      { id: 2, content: "Admin's post2", likes: [], comments: [] },
      { id: 3, content: "Admin's post3", likes: [], comments: [] }
    ]
  },
  {
    id: 3,
    email: 'user1@example.com',
    password: 'user1',
    role: 'user',
    posts: [
      { id: 4, content: "User 1's post", likes: [], comments: [] },
      { id: 5, content: "User 1's post", likes: [], comments: [] },
      { id: 6, content: "User 1's post", likes: [], comments: [] }
    ]
  },
  {
    id: 4,
    email: 'user2@example.com',
    password: 'user2',
    role: 'user',
    posts: [
      { id: 7, content: "User 2's post", likes: [], comments: [] },
      { id: 8, content: "User 2's post", likes: [], comments: [] },
      { id: 9, content: "User 2's post", likes: [], comments: [] }
    ]
  }
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});
function authenticate(req, res, next) {
  let token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      message: "Not logged In."
    })
  }
  var decoded = jwt.verify(token, secretKey);
  console.log(decoded, 'decode')
  req.user = decoded;
  next();
}
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ email: user.email, }, secretKey);
    // console.log("Generated token:", token); 
    return res.status(200).json({
      message: "Login Successful",
      token
    });
  } else {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
});
app.get('/isLoggedIn', authenticate, (req, res) => {
  let user = req.user;
  return res.status(200).json({
    message: "Welcome",
    user
  })
})
app.get('/posts', authenticate, (req, res) => {
  const otherPosts = users.flatMap(user => {
    return user.id !== req.user.id ? user.posts : [];
  });
  // console.log("Other posts:", otherPosts); 
  res.json(otherPosts);
});
app.get('/activeUserposts', authenticate, (req, res) => {
  console.log(req.user.id)
  const UsersPosts = users.filter(user => {
    return user.id === req.user.id ? user.posts : [];
  });
  // console.log("Other posts:", otherPosts); 
  res.json(UsersPosts);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패:', err));

// 스키마
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// 회원가입
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.json({ msg: '이미 등록된 이메일입니다.' });

  const user = new User({ username, email, password });
  await user.save();
  res.json({ msg: '회원가입 완료' });
});

// 로그인
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ msg: '이메일 또는 비밀번호가 틀렸습니다.' });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  res.json({ token, username: user.username });
});

// 글쓰기
app.post('/write', async (req, res) => {
  const { title, content, author } = req.body;
  const post = new Post({ title, content, author });
  await post.save();
  res.json({ msg: '글 등록 완료' });
});

// 글 목록
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 글 상세
app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: "글을 찾을 수 없습니다." });
  res.json(post);
});

// 글 삭제 (작성자만 가능)
app.delete('/posts/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "로그인이 필요합니다." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ msg: "사용자 정보가 유효하지 않습니다." });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "게시글이 존재하지 않습니다." });

    if (post.author !== user.username) {
      return res.status(403).json({ msg: "작성자만 글을 삭제할 수 있습니다." });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "삭제 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "서버 오류" });
  }
});

// 기본 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

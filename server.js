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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패:', err));

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
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); // ✅ 여기서 작성자 이름 가져옴

    if (!token || !username) {
      alert('로그인이 필요합니다.');
      window.location.href = 'login.html';
      return;
    }

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const res = await fetch('https://vscode-dev-1.onrender.com/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, author: username }) // ✅ 작성자 자동 포함
    });

    const data = await res.json();
    alert(data.msg || '글 등록 실패');

    if (res.ok) {
      window.location.href = 'index.html';
    }
  });
}



// 글 전체 조회
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 🔥 글 삭제
app.delete('/posts/:id', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "토큰 없음" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "게시글 없음" });

    if (post.author !== userEmail) {
      return res.status(403).json({ msg: "삭제 권한이 없습니다." });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "게시글이 삭제되었습니다." });

  } catch (err) {
    res.status(400).json({ msg: "잘못된 요청" });
  }
});

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: '게시글이 없습니다.' });
    res.json(post);
  } catch {
    res.status(400).json({ msg: '잘못된 요청입니다.' });
  }
});
// DELETE /posts/:id
app.delete('/posts/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "토큰이 없습니다." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(401).json({ msg: "유효하지 않은 사용자입니다." });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "게시글을 찾을 수 없습니다." });

    if (post.author !== user.username) {
      return res.status(403).json({ msg: "작성자만 삭제할 수 있습니다." });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "삭제 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "서버 오류" });
  }
});

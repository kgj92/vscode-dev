const BASE_URL = 'https://vscode-dev-1.onrender.com';

// 회원가입 처리
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.msg);
    if (res.ok) window.location.href = 'login.html';
  });
}

// 로그인 처리
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('로그인 성공!');
      window.location.href = 'index.html';
    } else {
      alert(data.msg);
    }
  });
}

// 글쓰기 처리
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      window.location.href = 'login.html';
      return;
    }

    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    if (res.ok) {
      alert('게시글이 등록되었습니다.');
      window.location.href = 'index.html';
    } else {
      alert(data.msg || '오류가 발생했습니다.');
    }
  });
}

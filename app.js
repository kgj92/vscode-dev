const BASE_URL = 'https://vscode-dev-1.onrender.com';

// ✅ 로그인 상태에 따라 버튼 토글
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (token) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username'); // 로그아웃 시 username도 제거
      alert('로그아웃 되었습니다.');
      window.location.reload();
    });
  }
});

// ✅ 로그인 처리
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username); // ✅ 사용자 이름 저장
        alert('로그인 성공!');
        window.location.href = 'index.html';
      } else {
        alert(data.msg || '로그인 실패');
      }
    } catch (error) {
      alert('로그인 요청 실패: ' + error.message);
    }
  });
}

// ✅ 회원가입 처리
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    if (confirmPassword && password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      alert(data.msg);

      if (res.ok) {
        window.location.href = 'login.html';
      }
    } catch (err) {
      alert('❌ 요청 실패: ' + err.message);
    }
  });
}

// ✅ 글쓰기 처리
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      window.location.href = 'login.html';
      return;
    }

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    console.log('📤 글 등록 시도:', { title, content, author: '익명' });

    try {
      const res = await fetch(`${BASE_URL}/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, author: username })
      });

      const data = await res.json();
      console.log('📥 서버 응답:', data);

      if (res.ok) {
        alert('글이 등록되었습니다.');
        window.location.href = 'index.html';
      } else {
        alert(data.msg || '글 등록 실패');
      }
    } catch (error) {
      alert('글쓰기 요청 실패: ' + error.message);
      console.error('❌ 오류:', error);
    }
  });
}

// ✅ 글 삭제 처리 (post-detail.html에서 실행)
const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const postId = new URLSearchParams(window.location.search).get('id');

    if (!token || !postId) {
      alert("삭제할 수 없습니다. 로그인 또는 글 정보가 없습니다.");
      return;
    }

    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        alert("삭제 완료");
        window.location.href = "index.html";
      } else {
        alert(data.msg || "삭제 실패");
      }
    } catch (err) {
      alert("삭제 요청 실패: " + err.message);
    }
  });
}

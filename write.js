// 글쓰기 처리
document.getElementById('write-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const token = localStorage.getItem('token');  // 로그인된 상태에서만 글 작성 가능
  
    if (!token) {
      alert('로그인 후 글을 작성할 수 있습니다.');
      window.location.href = 'login.html';  // 로그인 페이지로 리디렉션
      return;
    }
  
    const res = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // JWT 토큰을 Authorization 헤더로 전달
      },
      body: JSON.stringify({ title, content })
    });
  
    const data = await res.json();
    
    if (data.success) {
      alert('게시글 작성 성공!');
      window.location.href = '/';  // 홈 페이지로 리디렉션 (글 작성 후)
    } else {
      alert(data.msg);  // 오류 메시지
    }
  });
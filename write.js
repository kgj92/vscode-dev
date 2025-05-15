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
  
    const res = await fetch('https://vscode-dev-1.onrender.com', {
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

  document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  const title = document.getElementById("post_title").value;
  const content = document.getElementById("post_content").value;

  const res = await fetch(`${serverURL}/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, author: username }) // 👈 자동 삽입
  });

  const data = await res.json();
  alert(data.msg || "글이 등록되었습니다.");
  document.getElementById("postForm").reset();
  loadPosts();
});

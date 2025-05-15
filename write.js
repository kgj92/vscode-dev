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

  const res = await fetch("https://vscode-dev-1.onrender.com/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, author: username })
  });

  const data = await res.json();

  if (res.ok) {
    alert("글이 등록되었습니다.");
    document.getElementById("postForm").reset();
    loadPosts(); // 목록 새로고침
  } else {
    alert(data.msg || "글 등록 실패");
  }
});

const serverURL = "https://vscode-dev-1.onrender.com"; // 여기에 실제 서버 주소 입력

// 글 불러오기
fetch(`${serverURL}/posts`)
  .then(res => res.json())
  .then(posts => {
    const container = document.querySelector('.posts');
    container.innerHTML = ''; // 기존 글 비우기
    posts.forEach(post => {
      const el = document.createElement('div');
      el.className = 'post';
      el.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small>작성자: ${post.author} | ${new Date(post.createdAt).toLocaleString()}</small>
      `;
      container.appendChild(el);
    });
  })
  .catch(err => {
    console.error('글 불러오기 실패:', err);
  });

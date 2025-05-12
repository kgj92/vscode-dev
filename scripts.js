// 탭 전환 기능
const tabItems = document.querySelectorAll('.tab-item');
const tabPanes = document.querySelectorAll('.tab-pane');

tabItems.forEach(item => {
  item.addEventListener('click', function() {
    // 모든 탭에서 'active' 클래스 제거
    tabItems.forEach(tab => tab.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // 클릭한 탭에 'active' 클래스 추가
    item.classList.add('active');
    
    // 해당하는 탭 내용에 'active' 클래스 추가
    const tabContent = document.getElementById(item.getAttribute('data-tab'));
    tabContent.classList.add('active');
  });
});
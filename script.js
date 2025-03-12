document.getElementById('showPassword').addEventListener('change', function () {
  const passwordInput = this.parentElement.previousElementSibling;
  passwordInput.type = this.checked ? 'text' : 'password';
});

// 즉시 실행되는 코드로 변경
(function () {
  // 페이지 로드 완료 시 실행
  window.onload = function () {
    // 검색창 요소 찾기
    const searchInput = document.getElementById('menuSearch');
    console.log('Search Input Found:', searchInput); // 검색창 요소 확인

    if (!searchInput) {
      console.error('검색창을 찾을 수 없습니다!');
      return;
    }

    // 이벤트 리스너 추가
    searchInput.addEventListener('input', function () {
      console.log('입력 값:', this.value); // 입력 확인용
    });

    searchInput.addEventListener('keydown', function (event) {
      console.log('키 입력:', event.key); // 키 입력 확인용

      if (event.key === 'Enter') {
        event.preventDefault();
        const searchText = this.value.trim().toLowerCase();
        console.log('검색어:', searchText); // 검색어 확인용

        const menuItems = document.querySelectorAll('.sidebar .menu-item');
        console.log('찾은 메뉴 아이템 수:', menuItems.length); // 메뉴 아이템 확인용

        let found = false;

        menuItems.forEach((item) => {
          const menuText = item.textContent.trim().toLowerCase();
          console.log('비교 중:', menuText); // 비교 과정 확인용

          if (menuText.includes(searchText)) {
            found = true;
            console.log('일치하는 메뉴 발견:', menuText); // 일치 항목 확인용
            item.click();
            this.value = '';
          }
        });

        if (!found) {
          alert('일치하는 메뉴가 없습니다.');
        }
      }
    });

    console.log('검색 기능 초기화 완료');
  };
})();

console.log(document.getElementById('menuSearch'));

// 검색창이 존재하는지 확인
const searchInput = document.getElementById('menuSearch');
console.log('검색창 확인:', searchInput);

// 메뉴 아이템들이 존재하는지 확인
const menuItems = document.querySelectorAll('.sidebar .menu-item');
console.log('메뉴 아이템들:', menuItems);
console.log('메뉴 아이템 개수:', menuItems.length);

// 각 메뉴 아이템의 텍스트 출력
menuItems.forEach((item) => {
  console.log('메뉴 텍스트:', item.textContent.trim());
});

console.log('BODY 끝 스크립트 로드됨');

// 검색창 이벤트 리스너
window.onload = function () {
  console.log('페이지 로드 완료');

  var searchInput = document.getElementById('menuSearch');
  console.log('검색창 요소:', searchInput);

  if (searchInput) {
    searchInput.onclick = function () {
      console.log('검색창 클릭됨 (이벤트 리스너)');
    };
  }
};

// 검색 기능 구현
document
  .getElementById('menuSearch')
  .addEventListener('keyup', function (event) {
    // 테스트용 알림
    console.log('키 입력됨:', event.key);

    if (event.key === 'Enter') {
      const searchText = this.value.trim().toLowerCase();
      alert('검색어: ' + searchText); // 테스트용 알림

      // 사이드바 메뉴 아이템 찾기
      const menuItems = document.querySelectorAll('.sidebar .menu-item');

      let found = false;
      menuItems.forEach((item) => {
        const menuText = item.textContent.trim().toLowerCase();
        if (menuText.includes(searchText)) {
          found = true;
          alert('메뉴 찾음: ' + menuText); // 테스트용 알림
          item.click();
          this.value = '';
        }
      });

      if (!found) {
        alert('일치하는 메뉴가 없습니다.');
      }
    }
  });

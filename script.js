// 다크모드 관련 코드
function initDarkMode() {
  const body = document.body;
  body.classList.add('dark-mode');
}

// 안전감지기 목록 로딩 함수
async function getSensorList() {
  const tableBody = document.querySelector('.info-table tbody');
  if (!tableBody) {
    console.log('테이블 본문이 없습니다. 감지기 목록 업데이트를 건너뜁니다.');
    return;
  }

  try {
    // API 호출 (실제 API가 준비되면 주석 해제)
    // const response = await fetch('http://localhost:3000/api/sensors');
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    // console.log('API 응답:', data);

    // API 응답이 성공적이지 않은 경우 테스트 데이터 사용
    const sensors = getDefaultSensors();

    // 테이블 업데이트
    updateSensorTable(sensors, tableBody);
  } catch (error) {
    console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    handleError(tableBody);
  }
}

// 기본 데이터 반환 함수
function getDefaultSensors() {
  return [
    {
      id: 'GD 1',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 2',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.1 mA',
    },
    {
      id: 'GD 3',
      type: '가스감지기',
      signal: '끊김',
      status: '주의',
      value: '6.8 mA',
    },
    {
      id: 'GD 4',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.3 mA',
    },
    {
      id: 'GD 5',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 6',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.1 mA',
    },
    {
      id: 'GD 7',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 8',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.3 mA',
    },
    {
      id: 'GD 9',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.1 mA',
    },
    {
      id: 'GD 10',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 11',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.1 mA',
    },
    {
      id: 'GD 12',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 13',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.3 mA',
    },
    {
      id: 'GD 14',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'GD 15',
      type: '가스감지기',
      signal: '연결',
      status: '정상',
      value: '4.1 mA',
    },
    {
      id: 'FD 1',
      type: '화재감지기',
      signal: '연결',
      status: '정상',
      value: '4.5 mA',
    },
    {
      id: 'FD 2',
      type: '화재감지기',
      signal: '끊김',
      status: '위험',
      value: '19.8 mA',
    },
    {
      id: 'FD 3',
      type: '화재감지기',
      signal: '연결',
      status: '정상',
      value: '4.3 mA',
    },
    {
      id: 'FD 4',
      type: '화재감지기',
      signal: '연결',
      status: '정상',
      value: '4.2 mA',
    },
    {
      id: 'FD 5',
      type: '화재감지기',
      signal: '연결',
      status: '정상',
      value: '4.4 mA',
    },
    {
      id: 'FD 6',
      type: '화재감지기',
      signal: '연결',
      status: '정상',
      value: '4.3 mA',
    },
    {
      id: 'VD 1',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.25g',
    },
    {
      id: 'VD 2',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.28g',
    },
    {
      id: 'VD 3',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.22g',
    },
    {
      id: 'VD 4',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.24g',
    },
    {
      id: 'VD 5',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.27g',
    },
    {
      id: 'VD 6',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.26g',
    },
    {
      id: 'VD 7',
      type: '진동감지기',
      signal: '끊김',
      status: '주의',
      value: '0.82g',
    },
    {
      id: 'VD 8',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.23g',
    },
    {
      id: 'VD 9',
      type: '진동감지기',
      signal: '연결',
      status: '정상',
      value: '0.21g',
    },
  ];
}

// 테이블 업데이트 함수
function updateSensorTable(sensors, tableBody) {
  const rows = sensors
    .map(
      (sensor) => `
      <tr>
        <td>${sensor.id || '-'}</td>
        <td>${sensor.type || '-'}</td>
        <td><span class="signal-${
          sensor.signal === '연결' ? 'connected' : 'disconnected'
        }">${sensor.signal || '-'}</span></td>
        <td><span class="status-${getStatusClass(sensor.status)}">${
        sensor.status || '-'
      }</span></td>
        <td>${sensor.value || '-'}</td>
      </tr>
    `
    )
    .join('');

  tableBody.innerHTML =
    rows ||
    `
    <tr>
      <td colspan="5" style="text-align: center">
        데이터가 없습니다.
      </td>
    </tr>`;
}

// 상태에 따른 CSS 클래스 반환 함수
function getStatusClass(status) {
  switch (status) {
    case '정상':
      return 'normal';
    case '주의':
      return 'warning';
    case '위험':
      return 'danger';
    default:
      return 'normal';
  }
}

// 상태에 따른 아이콘 반환 함수
function getStatusIcon(status) {
  switch (status) {
    case '정상':
      return '<i class="fas fa-check-circle status-icon normal"></i>';
    case '주의':
      return '<i class="fas fa-exclamation-circle status-icon warning"></i>';
    case '위험':
      return '<i class="fas fa-times-circle status-icon danger"></i>';
    default:
      return '<i class="fas fa-circle status-icon normal"></i>';
  }
}

// 에러 처리 함수
function handleError(tableBody) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; color: red;">
        데이터를 불러오는 중 오류가 발생했습니다.<br>
        잠시 후 다시 시도해주세요.
      </td>
    </tr>
  `;
}

// 테이블 행 클릭 이벤트 처리 함수
function handleTableRowClick(e) {
  console.log('테이블 행 클릭됨');
  const row = e.target.closest('tr');
  if (!row) {
    console.log('클릭된 요소가 테이블 행이 아님');
    return;
  }

  const sensorId = row.cells[0].textContent.trim();
  console.log('선택된 센서 ID:', sensorId);

  const sensorElement = document.querySelector(`[data-sensor="${sensorId}"]`);
  const data = sensorData[sensorId];

  if (!sensorElement) {
    console.log('센서 요소를 찾을 수 없음:', sensorId);
    return;
  }

  if (!data) {
    console.log('센서 데이터를 찾을 수 없음:', sensorId);
    return;
  }

  // 지도에서 해당 센서로 스크롤
  sensorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // 다른 센서의 활성화 상태 제거
  document.querySelectorAll('[data-sensor]').forEach((sensor) => {
    if (sensor !== sensorElement) {
      sensor.classList.remove('active');
    }
  });

  // 클릭된 센서 활성화
  sensorElement.classList.add('active');

  // 말풍선 업데이트 및 표시
  updateTooltip(tooltip, sensorId, data, sensorElement);
  console.log('말풍선 업데이트 완료');
}

// 검색 기능 구현
function initSearch() {
  const searchInput = document.getElementById('menuSearch');
  if (!searchInput) return;

  searchInput.addEventListener('keyup', function (event) {
    // 검색어에서 띄어쓰기 제거하고 소문자로 변환
    const searchText = this.value.replace(/\s+/g, '').toLowerCase();
    const tableRows = document.querySelectorAll('.info-table tbody tr');
    let found = false;

    tableRows.forEach((row) => {
      // 셀의 텍스트에서 띄어쓰기 제거하고 소문자로 변환
      const sensorId = row.cells[0].textContent
        .replace(/\s+/g, '')
        .toLowerCase();
      const sensorType = row.cells[1].textContent
        .replace(/\s+/g, '')
        .toLowerCase();

      if (sensorId.includes(searchText) || sensorType.includes(searchText)) {
        found = true;
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    // 검색 결과가 없을 때 메시지 표시
    const tbody = document.querySelector('.info-table tbody');
    const noResultsRow = tbody.querySelector('.no-results');
    if (noResultsRow) {
      noResultsRow.remove();
    }

    if (!found) {
      const noResults = document.createElement('tr');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 20px;">
          검색 결과가 없습니다.
        </td>
      `;
      tbody.appendChild(noResults);
    }
  });
}

// 센서 데이터
const sensorData = {
  'GD 1': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 2': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.1 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 3': {
    type: '가스감지기',
    status: '주의',
    signal: '끊김',
    value: '6.8 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 4': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.3 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 5': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 6': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.1 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 7': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 8': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.3 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 9': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.1 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 10': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 11': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.1 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 12': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 13': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.3 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 14': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'GD 15': {
    type: '가스감지기',
    status: '정상',
    signal: '연결',
    value: '4.1 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 1': {
    type: '화재감지기',
    status: '정상',
    signal: '연결',
    value: '4.5 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 2': {
    type: '화재감지기',
    status: '위험',
    signal: '끊김',
    value: '19.8 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 3': {
    type: '화재감지기',
    status: '정상',
    signal: '연결',
    value: '4.3 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 4': {
    type: '화재감지기',
    status: '정상',
    signal: '연결',
    value: '4.2 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 5': {
    type: '화재감지기',
    status: '정상',
    signal: '연결',
    value: '4.4 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'FD 6': {
    type: '화재감지기',
    status: '정상',
    signal: '연결',
    value: '4.3 mA',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 1': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.25g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 2': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.28g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 3': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.22g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 4': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.24g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 5': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.27g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 6': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.26g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 7': {
    type: '진동감지기',
    status: '주의',
    signal: '끊김',
    value: '0.82g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 8': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.23g',
    lastUpdate: '2024-03-21 14:30:00',
  },
  'VD 9': {
    type: '진동감지기',
    status: '정상',
    signal: '연결',
    value: '0.21g',
    lastUpdate: '2024-03-21 14:30:00',
  },
};

// 전역 변수로 이벤트 리스너 참조 저장
let tooltip = null;
let sensorEventListeners = new Map();
let isInitialized = false; // 초기화 상태 추적

// 센서 데이터 초기화 함수
function initializeSensorData() {
  if (isInitialized) return;
  isInitialized = true;

  console.log('센서 데이터 초기화 시작');

  // 기존 tooltip 제거
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }

  // 새로운 tooltip 생성
  tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);
  console.log('새로운 말풍선 생성됨');

  // 기존 이벤트 리스너 제거
  removeAllSensorEventListeners();

  // 새로운 이벤트 리스너 추가
  document.querySelectorAll('[data-sensor]').forEach((sensor) => {
    addSensorEventListeners(sensor, tooltip);
  });

  // 테이블 클릭 이벤트 리스너 추가
  const tableBody = document.querySelector('.info-table tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const sensorId = row.cells[0].textContent.trim();
      const sensorElement = document.querySelector(
        `[data-sensor="${sensorId}"]`
      );
      const data = sensorData[sensorId];

      if (sensorElement && data) {
        console.log('센서 클릭됨:', { sensorId, data });

        // 다른 센서의 활성화 상태 제거
        document.querySelectorAll('[data-sensor]').forEach((sensor) => {
          if (sensor !== sensorElement) {
            sensor.classList.remove('active');
          }
        });

        // 클릭된 센서 활성화
        sensorElement.classList.add('active');

        // 말풍선 업데이트 및 표시
        updateTooltip(tooltip, sensorId, data, sensorElement);
      } else {
        console.log('센서 요소 또는 데이터를 찾을 수 없음:', {
          sensorId,
          sensorElement,
          data,
        });
      }
    });
  }
}

// 이벤트 리스너 제거 함수
function removeAllSensorEventListeners() {
  sensorEventListeners.forEach((listeners, sensor) => {
    listeners.forEach((listener, event) => {
      sensor.removeEventListener(event, listener);
    });
  });
  sensorEventListeners.clear();
}

// 센서 이벤트 리스너 추가 함수
function addSensorEventListeners(sensor, tooltip) {
  const clickHandler = (e) => handleSensorClick(e, tooltip);
  sensor.addEventListener('click', clickHandler);
}

// 센서 클릭 이벤트 핸들러
function handleSensorClick(e, tooltip) {
  e.stopPropagation();
  const sensorId = e.target.getAttribute('data-sensor');
  const data = sensorData[sensorId];

  if (data) {
    // 다른 센서의 활성화 상태 제거
    document.querySelectorAll('[data-sensor]').forEach((sensor) => {
      if (sensor !== e.target) {
        sensor.classList.remove('active');
      }
    });

    // 클릭된 센서 활성화
    e.target.classList.add('active');

    // 말풍선 업데이트 및 표시
    updateTooltip(tooltip, sensorId, data, e.target);
  }
}

// 말풍선 업데이트 함수
function updateTooltip(tooltip, sensorId, data, target) {
  if (!tooltip || !data) {
    console.log('말풍선 또는 데이터가 없습니다:', { tooltip, data });
    return;
  }

  console.log('말풍선 업데이트 시작:', { sensorId, data });

  // 상태에 따른 클래스 설정
  const statusClass = getStatusClass(data.status);
  const statusIcon = getStatusIcon(data.status);

  // 말풍선 내용 업데이트
  tooltip.innerHTML = `
    <div class="tooltip-content">
      <div class="tooltip-item">
        <span class="tooltip-label">센서 ID</span>
        <span class="tooltip-value">${sensorId}</span>
      </div>
      <div class="tooltip-item">
        <span class="tooltip-label">종류</span>
        <span class="tooltip-value">${data.type}</span>
      </div>
      <div class="tooltip-item">
        <span class="tooltip-label">상태</span>
        <span class="tooltip-value status-${statusClass}">${data.status}</span>
      </div>
      <div class="tooltip-item">
        <span class="tooltip-label">측정값</span>
        <span class="tooltip-value">${data.value}</span>
      </div>
    </div>
  `;

  // 상태에 따른 스타일 적용
  tooltip.classList.remove('normal', 'warning', 'danger');
  tooltip.classList.add(statusClass);

  // 말풍선 위치 설정 및 표시
  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  // 말풍선 위치 계산
  let left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.top + scrollY - tooltipRect.height - 10;

  // 화면 경계 체크 및 조정
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 좌우 경계 체크
  if (left < scrollX) {
    left = scrollX + 10; // 왼쪽 여백
  } else if (left + tooltipRect.width > scrollX + viewportWidth) {
    left = scrollX + viewportWidth - tooltipRect.width - 10; // 오른쪽 여백
  }

  // 상하 경계 체크
  if (top < scrollY) {
    // 위쪽에 공간이 없으면 아래에 표시
    top = rect.bottom + scrollY + 10;
    tooltip.classList.remove('top');
  } else if (top + tooltipRect.height > scrollY + viewportHeight) {
    // 아래쪽에 공간이 없으면 위에 표시
    top = rect.top + scrollY - tooltipRect.height - 10;
    tooltip.classList.add('top');
  }

  // 말풍선 스타일 직접 설정
  tooltip.style.position = 'absolute'; // fixed에서 absolute로 변경
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.display = 'block';
  tooltip.style.zIndex = '1000';
  tooltip.style.opacity = '1';
  tooltip.style.visibility = 'visible';
  tooltip.style.pointerEvents = 'auto';

  console.log('말풍선 위치 설정:', {
    left,
    top,
    scrollX,
    scrollY,
    viewportWidth,
    viewportHeight,
    tooltipRect: {
      width: tooltipRect.width,
      height: tooltipRect.height,
    },
  });
}

// 문서 클릭 이벤트 핸들러 수정
document.addEventListener('click', (e) => {
  const tooltip = document.querySelector('.tooltip');
  const clickedSensor = e.target.closest('[data-sensor]');
  const clickedTableRow = e.target.closest('tr');

  if (!clickedSensor && !clickedTableRow && tooltip) {
    console.log('말풍선 숨김 처리');
    tooltip.style.display = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.style.pointerEvents = 'none';
    document.querySelectorAll('[data-sensor]').forEach((sensor) => {
      sensor.classList.remove('active');
    });
  }
});

// 차트 초기화 함수
function initializeCharts() {
  console.log('차트 초기화 시작');

  // 기존 차트 제거
  Chart.helpers.each(Chart.instances, (instance) => {
    instance.destroy();
  });

  // 진동 감지기 차트 (9개)
  for (let i = 1; i <= 9; i++) {
    const vibrationCtx = document.getElementById(`vibrationChart${i}`);
    if (!vibrationCtx) {
      console.log(`vibrationChart${i} 캔버스를 찾을 수 없습니다.`);
      continue;
    }

    // 기존 차트가 있다면 제거
    const existingChart = Chart.getChart(vibrationCtx);
    if (existingChart) {
      existingChart.destroy();
    }

    // 데이터 생성
    const data = Array.from({ length: 10 }, () => 0.25 + Math.random() * 0.1);
    const maxValue = Math.max(...data);
    const yAxisMax = maxValue * 1.1; // 최대값보다 10% 더 큰 값으로 설정

    const chart = new Chart(vibrationCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => `${10 - i}분 전`),
        datasets: [
          {
            label: `진동 감지기 ${i} 평균값`,
            data: data,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          console.log('진동 감지기 차트 클릭됨:', i);
          updateBottomChart(i);
        },
        plugins: {
          title: {
            display: true,
            text: `진동 감지기 ${i}`,
            color: '#fff',
            font: {
              size: 14,
              weight: '600',
              family: 'Pretendard',
            },
            padding: {
              top: 0,
              bottom: 0,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            titleFont: {
              size: 13,
              family: 'Pretendard',
            },
            bodyFont: {
              size: 12,
              family: 'Pretendard',
            },
            padding: 8,
            callbacks: {
              label: function (context) {
                return `진동값: ${context.parsed.y.toFixed(2)}g`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: yAxisMax,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false,
            },
            ticks: {
              color: '#888',
              font: {
                size: 11,
                family: 'Pretendard',
              },
              padding: 5,
            },
            border: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#888',
              font: {
                size: 11,
                family: 'Pretendard',
              },
              padding: 5,
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
    console.log(`vibrationChart${i} 초기화 완료`);
  }

  // 하단 차트 초기화
  const bottomCtx = document.getElementById('bottomChart');
  if (bottomCtx) {
    // 기존 차트가 있다면 제거
    const existingChart = Chart.getChart(bottomCtx);
    if (existingChart) {
      existingChart.destroy();
    }

    // 데이터 생성
    const data = Array.from({ length: 360 }, () => 0.25 + Math.random() * 0.1);
    const maxValue = Math.max(...data);
    const yAxisMax = maxValue * 1.1; // 최대값보다 10% 더 큰 값으로 설정

    const bottomChart = new Chart(bottomCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: Array.from({ length: 360 }, (_, i) => {
          const date = new Date();
          date.setMinutes(date.getMinutes() - (359 - i));
          return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }),
        datasets: [
          {
            data: data,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: '진동 감지기',
            color: '#fff',
            font: {
              size: 18,
              weight: '600',
              family: 'Pretendard',
            },
            padding: {
              top: 0,
              bottom: 0,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            titleFont: {
              size: 14,
              family: 'Pretendard',
            },
            bodyFont: {
              size: 13,
              family: 'Pretendard',
            },
            padding: 10,
            callbacks: {
              label: function (context) {
                return `진동값: ${context.parsed.y.toFixed(2)}g`;
              },
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: 'ctrl',
                mode: 'x',
              },
              pinch: {
                enabled: true,
                mode: 'x',
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false,
            },
            ticks: {
              color: '#888',
              font: {
                size: 12,
                family: 'Pretendard',
              },
              padding: 8,
              callback: function (value) {
                return value.toFixed(2) + 'g';
              },
            },
            border: {
              display: false,
            },
            adapters: {
              type: 'linear',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#888',
              font: {
                size: 12,
                family: 'Pretendard',
              },
              padding: 8,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
            },
            border: {
              display: false,
            },
          },
        },
      },
    });

    // 더블 클릭 이벤트 리스너 추가
    bottomCtx.addEventListener('dblclick', (event) => {
      const chart = Chart.getChart(bottomCtx);
      if (chart) {
        const data = chart.data.datasets[0].data;
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const padding = (maxValue - minValue) * 0.1; // 10% 여백

        chart.options.scales.y.min = Math.max(0, minValue - padding);
        chart.options.scales.y.max = maxValue + padding;
        chart.update();
      }
    });

    console.log('하단 차트 초기화 완료');
  } else {
    console.log('하단 차트 캔버스를 찾을 수 없습니다.');
  }
}

// 하단 차트 업데이트 함수 수정
function updateBottomChart(sensorIndex) {
  const bottomChart = Chart.getChart('bottomChart');
  if (!bottomChart) {
    console.log('하단 차트를 찾을 수 없습니다.');
    return;
  }

  console.log('하단 차트 업데이트 시작:', sensorIndex);

  // 현재 시간부터 6시간 전까지의 레이블 생성
  const labels = Array.from({ length: 360 }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (359 - i));
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  });

  // 새로운 데이터 생성 (실제로는 API에서 가져와야 함)
  const data = Array.from({ length: 360 }, () => 0.25 + Math.random() * 0.1);
  const maxValue = Math.max(...data);
  const yAxisMax = maxValue * 1.1; // 최대값보다 10% 더 큰 값으로 설정

  // 차트 업데이트
  bottomChart.data.labels = labels;
  bottomChart.data.datasets[0].data = data;
  bottomChart.options.plugins.title.text = `진동 감지기 ${sensorIndex} 상세 데이터`;
  bottomChart.options.scales.y.max = yAxisMax;
  bottomChart.update();
  console.log('하단 차트 업데이트 완료');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('페이지 로드됨');
    initDarkMode();
    initSearch();
    initializeSensorData();

    // Chart.js zoom 플러그인 등록
    Chart.register(ChartZoom);

    // 차트 초기화 실행
    initializeCharts();

    getSensorList();
    setInterval(getSensorList, 300000); // 5분마다 감지기 목록 갱신

    // 테이블 클릭 이벤트 리스너 추가
    const tableBody = document.querySelector('.info-table tbody');
    if (tableBody) {
      tableBody.addEventListener('click', handleTableRowClick);
      console.log('테이블 클릭 이벤트 리스너가 추가되었습니다.');
    } else {
      console.error('테이블 본문을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('초기화 중 오류가 발생했습니다:', error);
  }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  removeAllSensorEventListeners();
  if (tooltip) {
    tooltip.remove();
  }
});

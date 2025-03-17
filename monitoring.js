// 현재 선택된 차트 ID를 저장할 변수
let selectedChartId = null;
let sensorData = null;

// 차트 초기화 함수
function initializeCharts() {
  console.log('차트 초기화 시작');

  // 차트 설정 옵션
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#888',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          callback: function (value) {
            return `${value}분`;
          },
        },
        title: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#888',
        },
        title: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '',
        color: '#fff',
        font: {
          size: 14,
          family: 'Pretendard',
          weight: '600',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  // 진동 감지기 차트 초기화
  for (let i = 1; i <= 9; i++) {
    const chartId = `vibrationChart${i}`;
    const canvas = document.getElementById(chartId);

    if (!canvas) {
      console.error(`${chartId} 캔버스를 찾을 수 없습니다.`);
      continue;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error(`${chartId}의 컨텍스트를 가져올 수 없습니다.`);
      continue;
    }

    try {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(10)
            .fill('')
            .map((_, i) => `${i}`),
          datasets: [
            {
              data: Array(10).fill(0),
              borderColor: '#2196f3',
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
              tension: 0.4,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              ...commonOptions.plugins.title,
              text: `진동감지기 ${i} 실시간 데이터`,
            },
          },
          onClick: (event, elements) => {
            selectedChartId = chartId;
            updateBottomChart(chartId);
          },
        },
      });
      console.log(`${chartId} 차트가 성공적으로 초기화되었습니다.`);
    } catch (error) {
      console.error(`${chartId} 차트 생성 중 오류 발생:`, error);
    }
  }

  // 하단 차트 초기화
  const bottomCanvas = document.getElementById('bottomChart');
  if (!bottomCanvas) {
    console.error('하단 차트 캔버스를 찾을 수 없습니다.');
    return;
  }

  try {
    const bottomCtx = bottomCanvas.getContext('2d');
    if (!bottomCtx) {
      console.error('하단 차트 컨텍스트를 가져올 수 없습니다.');
      return;
    }

    const bottomChart = new Chart(bottomCtx, {
      type: 'line',
      data: {
        labels: Array(360)
          .fill('')
          .map((_, i) => `${Math.floor(i / 60)}`),
        datasets: [
          {
            data: Array(360).fill(0),
            borderColor: '#2196f3',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          title: {
            ...commonOptions.plugins.title,
            text: '진동감지기 상세 데이터',
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
        },
      },
    });
    console.log('하단 차트가 성공적으로 초기화되었습니다.');
  } catch (error) {
    console.error('하단 차트 생성 중 오류 발생:', error);
  }
}

// 하단 차트 업데이트 함수
function updateBottomChart(selectedChartId) {
  const bottomChart = Chart.getChart('bottomChart');
  const selectedChart = Chart.getChart(selectedChartId);

  if (bottomChart && selectedChart) {
    // 선택된 차트의 번호 추출
    const sensorNumber = selectedChartId.replace('vibrationChart', '');

    // 하단 차트 제목 업데이트
    bottomChart.options.plugins.title.text = `진동감지기 ${sensorNumber} 상세 데이터`;

    // 데이터 업데이트
    const data = Array.from({ length: 360 }, () => 0.25 + Math.random() * 0.1);
    bottomChart.data.datasets[0].data = data;
    bottomChart.update('none');
  }
}

// 차트 데이터 업데이트 함수
function updateChartData() {
  // 각 차트의 데이터 업데이트 로직
  for (let i = 1; i <= 9; i++) {
    const chartId = `vibrationChart${i}`;
    const chart = Chart.getChart(chartId);
    if (chart) {
      const data = Array.from({ length: 10 }, () => 0.25 + Math.random() * 0.1);
      chart.data.datasets[0].data = data;
      chart.update('none');
    }
  }

  // 하단 차트 업데이트 (선택된 차트가 있는 경우에만)
  if (selectedChartId) {
    updateBottomChart(selectedChartId);
  }
}

// 센서 데이터 초기화
function initializeSensorData() {
  sensorData = {
    'GD 1': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 2': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.1 mA',
    },
    'GD 3': {
      type: '가스감지기',
      status: '주의',
      signal: '끊김',
      value: '6.8 mA',
    },
    'GD 4': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.3 mA',
    },
    'GD 5': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 6': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.1 mA',
    },
    'GD 7': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 8': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.3 mA',
    },
    'GD 9': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.1 mA',
    },
    'GD 10': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 11': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.1 mA',
    },
    'GD 12': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 13': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.3 mA',
    },
    'GD 14': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'GD 15': {
      type: '가스감지기',
      status: '정상',
      signal: '연결',
      value: '4.1 mA',
    },
    'FD 1': {
      type: '화재감지기',
      status: '정상',
      signal: '연결',
      value: '4.5 mA',
    },
    'FD 2': {
      type: '화재감지기',
      status: '위험',
      signal: '끊김',
      value: '19.8 mA',
    },
    'FD 3': {
      type: '화재감지기',
      status: '정상',
      signal: '연결',
      value: '4.3 mA',
    },
    'FD 4': {
      type: '화재감지기',
      status: '정상',
      signal: '연결',
      value: '4.2 mA',
    },
    'FD 5': {
      type: '화재감지기',
      status: '정상',
      signal: '연결',
      value: '4.4 mA',
    },
    'FD 6': {
      type: '화재감지기',
      status: '정상',
      signal: '연결',
      value: '4.3 mA',
    },
    'VD 1': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.25g',
    },
    'VD 2': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.28g',
    },
    'VD 3': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.22g',
    },
    'VD 4': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.24g',
    },
    'VD 5': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.27g',
    },
    'VD 6': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.26g',
    },
    'VD 7': {
      type: '진동감지기',
      status: '주의',
      signal: '끊김',
      value: '0.82g',
    },
    'VD 8': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.23g',
    },
    'VD 9': {
      type: '진동감지기',
      status: '정상',
      signal: '연결',
      value: '0.21g',
    },
  };
}

// 상태에 따른 클래스 반환 함수
function getStatusClass(status) {
  switch (status.trim()) {
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

document.addEventListener('DOMContentLoaded', () => {
  const sensors = document.querySelectorAll('#map img[data-sensor]');
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  document.body.appendChild(tooltip);

  let tooltipTimeout = null; // 툴팁 사라짐 방지 타이머

  sensors.forEach((sensor) => {
    sensor.addEventListener('mouseenter', (e) => showTooltip(e, sensor));
    sensor.addEventListener('mouseleave', startHideTooltipTimer);
    sensor.addEventListener('click', (e) => showTooltip(e, sensor, true));
  });

  // 마우스가 툴팁 위에 있으면 숨기지 않음
  tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimeout));
  tooltip.addEventListener('mouseleave', startHideTooltipTimer);

  function showTooltip(event, sensor, isClick = false) {
    clearTimeout(tooltipTimeout); // 툴팁 숨김 방지

    const sensorRect = sensor.getBoundingClientRect();
    const sensorId = sensor.dataset.sensor;
    const data = sensorData[sensorId];

    if (!data) return;

    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-item">
          <span class="tooltip-label">분류</span>
          <span class="tooltip-value">${sensorId}</span>
        </div>
        <div class="tooltip-item">
          <span class="tooltip-label">종류</span>
          <span class="tooltip-value">${data.type}</span>
        </div>
        <div class="tooltip-item">
          <span class="tooltip-label">신호</span>
          <span class="tooltip-value">${data.signal}</span>
        </div>
        <div class="tooltip-item">
          <span class="tooltip-label">상태</span>
          <span class="tooltip-value">${data.status}</span>
        </div>
        <div class="tooltip-item">
          <span class="tooltip-label">값</span>
          <span class="tooltip-value">${data.value}</span>
        </div>
      </div>
    `;

    // 툴팁 스타일 적용
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';

    // 감지기 아이콘 중앙에 툴팁 위치 맞추기
    let tooltipX = sensorRect.left + sensorRect.width / 2;
    let tooltipY = sensorRect.top + window.scrollY - 5; // 약간의 여유 공간 추가

    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    tooltip.style.transform = 'translate(-50%, -100%)'; // 정 중앙에서 위쪽으로 배치

    // 툴팁이 화면 밖으로 나가지 않도록 보정
    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();

      // 좌우 보정
      if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
        tooltip.style.transform = 'translate(0, -100%)';
      } else if (tooltipRect.left < 0) {
        tooltip.style.left = `10px`;
        tooltip.style.transform = 'translate(0, -100%)';
      }

      // 상단 보정: 툴팁이 너무 위로 올라가면 감지기 아래에 배치
      if (tooltipRect.top < 0) {
        tooltip.style.top = `${sensorRect.bottom + 10}px`;
        tooltip.style.transform = 'translate(-50%, 0)';
      }
    }, 10);

    // 툴팁 상태 스타일 적용
    tooltip.classList.remove('normal', 'warning', 'danger');
    tooltip.classList.add(getStatusClass(data.status));

    // 클릭 시 툴팁 유지
    if (isClick) {
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener('click', handleDocumentClick);
    }
  }

  function startHideTooltipTimer() {
    tooltipTimeout = setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => (tooltip.style.display = 'none'), 300); // 부드럽게 사라지도록 딜레이 추가
    }, 500); // 0.5초 후 사라지도록 설정
  }

  function hideTooltip() {
    clearTimeout(tooltipTimeout);
    tooltip.style.opacity = '0';
    setTimeout(() => (tooltip.style.display = 'none'), 300);
    document.removeEventListener('click', handleDocumentClick);
  }

  function handleDocumentClick(e) {
    if (!tooltip.contains(e.target) && !e.target.hasAttribute('data-sensor')) {
      hideTooltip();
    }
  }

  // 감지기 목록 테이블 이벤트
  document.querySelectorAll('.info-table tbody tr').forEach((row) => {
    row.addEventListener('mouseenter', function (event) {
      const sensorName = row.cells[0].textContent.trim();
      const sensorIcon = document.querySelector(
        `img[data-sensor='${sensorName}']`
      );
      if (sensorIcon) {
        showTooltip(event, sensorIcon);
        sensorIcon.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    row.addEventListener('mouseleave', startHideTooltipTimer);
  });

  // 센서 데이터 초기화
  initializeSensorData();

  // Chart.js 초기화
  setTimeout(() => {
    initializeCharts();
    // 1초마다 차트 데이터 업데이트
    setInterval(updateChartData, 1000);
  }, 500);
});

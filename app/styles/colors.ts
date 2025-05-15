// 모니터링 시스템 색상 정의
export const colors = {
  // 공통 브랜드 색상
  primary: {
    main: '#4D7298', // 메인 브랜드 색상 - GNB, 버튼 등
    light: '#60A5FA', // 밝은 브랜드 색상 - 호버 상태, 강조 요소
    dark: '#2563EB', // 진한 브랜드 색상 - 클릭 상태, 중요 요소
  },

  // 테마 색상
  theme: {
    dark: {
      background: '#141414',
      surface: '#1a1a1a',
      border: '#202020',
      text: {
        primary: '#F8FAFC',
        secondary: '#E2E8F0',
      },
    },
    light: {
      background: '#FFFFFF',
      surface: '#F8FAFC',
      border: '#E2E8F0',
      text: {
        primary: '#111827', // 더 진한 남색(네이비)로 변경 - 상단배너 등 주요 텍스트 가독성 향상
        secondary: '#475569',
      },
    },
  },

  // 페이지 배경 그라데이션 (/monitoring/detail/[id])
  gradient: {
    main: {
      from: '#141414', // 메인 배경 그라데이션 시작 색상
      to: '#141414', // 메인 배경 그라데이션 끝 색상
    },
  },

  // 센서 상태 표시 색상 (/monitoring/detail/[id])
  status: {
    normal: {
      text: '#2E7D32', // 정상 상태 텍스트
      background: '#E8F5E9', // 정상 상태 배경
      dark: '#065F46', // 정상 상태 진한 색상
      light: '#D1FAE5', // 정상 상태 밝은 색상
    },
    warning: {
      text: '#EF6C00', // 경고 상태 텍스트
      background: '#FFF3E0', // 경고 상태 배경
      dark: '#92400E', // 경고 상태 진한 색상
      light: '#FEF3C7', // 경고 상태 밝은 색상
    },
    danger: {
      text: '#C62828', // 위험 상태 텍스트
      background: '#FFEBEE', // 위험 상태 배경
      dark: '#991B1B', // 위험 상태 진한 색상
      light: '#FEE2E2', // 위험 상태 밝은 색상
    },
  },

  // 센서 종류별 색상 (/monitoring/detail/[id] 맵 뷰)
  sensor: {
    gas: '#22C576', // 가스 센서 아이콘 및 그래프
    fire: '#D81159', // 화재 센서 아이콘 및 그래프
    vibration: '#F2C035', // 진동 센서 아이콘 및 그래프
  },

  // 레이아웃 배경 색상
  background: {
    primary: '#1a1a1a', // 카드, 팝업 등 주요 컴포넌트 배경
    secondary: '#1a1a1a', // 리스트 헤더, 구분선 등 보조 배경
    tertiary: '#1a1a1a', // 그래프 컨테이너, 상세 정보 배경
    overlay: 'rgba(15, 23, 42, 0.6)', // 모달 오버레이 배경
    active: '#141414',
    hover: '#141414',
    light: '#141414',
  },

  // 텍스트 색상
  text: {
    primary: '#F8FAFC', // 주요 텍스트 (제목, 강조 텍스트)
    secondary: '#E2E8F0', // 보조 텍스트 (설명, 부가 정보)
    tertiary: '#6B7280', // 덜 중요한 텍스트 (시간, 단위 등)
    light: '#94A3B8', // 매우 연한 텍스트 (비활성화, 힌트)
    white: '#FFFFFF', // 흰색 텍스트 (버튼, 반전 텍스트)
  },

  // 테두리 색상
  border: {
    color: '#202020',
    width: '1px',
    style: 'solid',
    radius: '16px',
    glow: 'rgba(29, 56, 120, 0.5)',
  },

  // 테두리 스타일 프리셋
  borderPreset: {
    card: {
      color: '#202020', // 카드 테두리 색상
      width: '1px', // 테두리 두께
      style: 'solid', // 테두리 스타일
      radius: '16px', // 테두리 곡률
      glow: 'rgba(29, 56, 120, 0.5)', // 테두리 글로우 효과
    },
  },

  // 그래프 관련 색상 (/monitoring/detail/[id] 차트)
  chart: {
    colorSets: [
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#04A777',
        fill: '#04A777',
      },
      {
        line: '#D90368',
        fill: '#D90368',
      },
      {
        line: '#D90368',
        fill: '#D90368',
      },
      {
        line: '#FB8B24',
        fill: '#FB8B24',
      },
    ],
    title: {
      text: '#FFFFFF', // 제목 텍스트 색상
      background: '#1a1a1a', // 제목 배경 색상
      border: '#202020', // 제목 테두리 색상
      status: {
        background: '#E8F5E9', // 상태 배경 색상
        text: '#2E7D32', // 상태 텍스트 색상
        border: '#E9ECEF', // 상태 테두리 색상
      },
    },
    grid: {
      line: '#E9ECEF', // 그리드 라인 색상
      opacity: 0.6, // 그리드 라인 투명도
    },
    axis: {
      line: '#E9ECEF', // 축 라인 색상
      text: '#E9ECEF', // 축 텍스트 색상
      opacity: 0.8, // 축 투명도
    },
    area: {
      opacity: 0.3, // 그래프 영역 투명도
      glow: 'rgba(78, 187, 163, 0.65)', // 테두리 글로우 효과
    },
    fillOpacity: 0.1,
  },

  // 투명도가 있는 색상 (오버레이, 그림자 등)
  transparent: {
    white: {
      10: 'rgba(255, 255, 255, 0.1)', // 매우 연한 흰색 오버레이
      15: 'rgba(255, 255, 255, 0.15)', // 연한 흰색 오버레이
      20: 'rgba(255, 255, 255, 0.2)', // 중간 흰색 오버레이
      30: 'rgba(255, 255, 255, 0.3)', // 진한 흰색 오버레이
      70: 'rgba(255, 255, 255, 0.7)', // 매우 진한 흰색 오버레이
      90: 'rgba(255, 255, 255, 0.9)', // 거의 불투명한 흰색
    },
    black: {
      3: 'rgba(0, 0, 0, 0.03)', // 매우 연한 그림자
      85: 'rgba(0, 0, 0, 0.85)', // 진한 툴팁 배경
    },
  },
} as const;

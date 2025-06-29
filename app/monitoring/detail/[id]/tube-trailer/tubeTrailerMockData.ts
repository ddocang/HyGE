// 상태값 매핑 함수 (정상, 경고, 비활성만)
export function getStatusType(value: string) {
  if (value === '정상') return 'normal';
  if (value === '경고') return 'warning';
  if (value === '비활성') return 'inactive';
  return '';
}

export const tubeTrailerMockData = [
  {
    id: '1',
    carNo: '7780',
    lat: 37.459058,
    lng: 129.173348,
    coupling: '비활성',
    landingGearL: '비활성',
    landingGearR: '비활성',
    tBrake: '비활성',
    gasSensor: '비활성',
    backgroundColor: '#FFD1DC', // 연한 분홍색
  },
  {
    id: '2',
    carNo: '6684',
    lat: 37.459129,
    lng: 129.173199,
    coupling: '비활성',
    landingGearL: '비활성',
    landingGearR: '비활성',
    tBrake: '비활성',
    gasSensor: '비활성',
    backgroundColor: '#98FB98', // 연한 초록색
  },
  {
    id: '3',
    carNo: '8628',
    lat: 37.458991,
    lng: 129.173524,
    coupling: '비활성',
    landingGearL: '비활성',
    landingGearR: '비활성',
    tBrake: '비활성',
    gasSensor: '비활성',
    backgroundColor: '#87CEEB', // 하늘색
  },
];

// 진동감지기별 위험 임계값과 단위 정보를 한 곳에서만 관리
export const VIBRATION_THRESHOLDS: Record<
  string,
  { value: number; unit: string }
> = {
  'vibration-1': { value: 90, unit: 'mm/s' },
  'vibration-2': { value: 90, unit: 'mm/s' },
  'vibration-3': { value: 90, unit: 'mm/s' },
  'vibration-4': { value: 90, unit: 'mm/s' },
  'vibration-5': { value: 90, unit: 'mm/s' },
  'vibration-6': { value: 90, unit: 'mm/s' },
  'vibration-7': { value: 19, unit: 'm/s²' },
  'vibration-8': { value: 40, unit: 'mm/s' },
  'vibration-9': { value: 40, unit: 'mm/s' },
  'vibration2-1': { value: 19, unit: 'm/s²' },
  'vibration2-2': { value: 50, unit: 'mm/s' },
  'vibration2-3': { value: 45, unit: 'mm/s' },
};

export function getVibrationThreshold(id: string) {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('vibrationThresholdInputs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[id] !== undefined) return parsed[id];
      }
    } catch {}
  }
  return VIBRATION_THRESHOLDS[id]?.value ?? 500;
}

export function getVibrationUnit(id: string) {
  return VIBRATION_THRESHOLDS[id]?.unit ?? '';
}

// 진동센서 id 매핑 함수
export function getVibrationSensorKey(sensor: { id: number; name: string }) {
  if (sensor.id === 12 || sensor.name === '진동감지기1') return 'vibration2-1';
  if (sensor.id === 13 || sensor.name === '진동감지기2') return 'vibration2-2';
  if (sensor.id === 14 || sensor.name === '진동감지기3') return 'vibration2-3';
  return String(sensor.id);
}

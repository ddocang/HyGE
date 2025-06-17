'use client';
import useWebSocket from '@/hooks/useWebSocket'; // ← 추가
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  LabelList,
} from 'recharts';
import {
  Container,
  TopBanner,
  BannerBackground,
  DarkOverlay,
  BannerContent,
  TitleContainer,
  Title,
  Subtitle,
  UpdateTime,
  ContentSection,
  MapSection,
  LeftColumn,
  MapView,
  SensorCard,
  ListHeader,
  SensorList,
  SensorItem,
  SensorNo,
  SensorType,
  SensorConnection,
  SensorStatus,
  SensorValue,
  SensorTitle,
  GNB,
  Logo,
  LogoImageWrapper,
  MainMenu,
  NavLinkStyle,
  BackButton,
  SensorHeader,
  FilterButton,
  VibrationGraphContainer,
  VibrationGraphCard,
  CustomTooltip,
  DetailedGraphPopup,
  PopupOverlay,
  PopupHeader,
  CloseButton,
  DetailedGraphContainer,
  MapContainer,
  SensorTooltip,
  LogButton,
  LogPopup,
  LogHeader,
  LogContent,
  LogItem,
  BannerTitle,
  FilterDropdown,
  FilterMenu,
  FilterMenuItem,
  PopupButton,
  GraphStatsBar,
} from '../styles';
import { colors } from '@/app/styles/colors';
import { ChevronDown } from 'lucide-react';
import ThemeToggleButton from '@/app/components/ThemeToggleButton';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import {
  getVibrationThreshold,
  getVibrationUnit,
  getVibrationSensorKey,
} from '@/hooks/useVibrationThresholds';
import VibrationThresholdModal from '@/components/VibrationThresholdModal';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wxsmvftivxerlchikwpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M'
);

// 진동 그래프 세로 배치용 컨테이너
const VibrationGraphContainerColumn = styled(VibrationGraphContainer)`
  display: flex !important;
  flex-direction: column !important;
  grid-template-columns: none !important;
  grid-template-rows: none !important;
  gap: 24px;
  width: 100%;
`;

interface SensorBase {
  id: number;
  name: string;
  status: string;
}

interface GasSensor extends SensorBase {
  value?: string;
}

interface FireSensor extends SensorBase {
  value?: string;
}

interface DetailedVibrationDataPoint {
  time: string;
  timestamp: number;
  value: number;
}

interface VibrationDataPoint {
  time: string;
  value: number;
}

interface VibrationSensor extends SensorBase {
  value: string;
  status: string;
  data: VibrationDataPoint[];
  detailedData: DetailedVibrationDataPoint[];
}

interface FacilityDetail {
  name: string;
  type: string;
  address: string;
  status: 'open';
  phone: string;
  imageUrl: string;
  operationHours: string;
  capacity: string;
  pressure: string;
  sensors: {
    gas: GasSensor[];
    fire: FireSensor[];
    vibration: VibrationSensor[];
  };
}

// 좌표 변환 함수 (10% 여백, 80% 영역)
function convertX(x: number) {
  return 0.1 * 828 + x * 0.8;
}
function convertY(y: number) {
  return 0.1 * 672 + y * 0.8;
}

// 가스 감지기 정보 배열
const GAS_SENSORS = [
  { id: 'gas-2', x: convertX(385), y: convertY(123), name: '가스감지기2' },
  { id: 'gas-5', x: convertX(80), y: convertY(123), name: '가스감지기5' },
  { id: 'gas-1', x: convertX(540), y: convertY(360), name: '가스감지기1' },
  { id: 'gas-4', x: convertX(360), y: convertY(360), name: '가스감지기4' },
  { id: 'gas-3', x: convertX(150), y: convertY(360), name: '가스감지기3' },
  { id: 'gas-6', x: convertX(520), y: convertY(550), name: '가스감지기6' },
  { id: 'gas-7', x: convertX(720), y: convertY(130), name: '가스감지기7' },
  { id: 'gas-8', x: convertX(552), y: convertY(130), name: '가스감지기8' },
];

// 화재 감지기 정보 배열
const FIRE_SENSORS = [
  { id: 'fire-1', x: convertX(520), y: convertY(500), name: '화재감지기1' },
  { id: 'fire-2', x: convertX(800), y: convertY(50), name: '화재감지기2' },
  { id: 'fire-3', x: convertX(42), y: convertY(460), name: '화재감지기3' },
];

// 진동 감지기 정보 배열
const VIBRATION_SENSORS = [
  {
    id: 'vibration2-1',
    x: convertX(385),
    y: convertY(155),
    name: '진동감지기1',
  },
  {
    id: 'vibration2-2',
    x: convertX(585),
    y: convertY(130),
    name: '진동감지기2',
  },
  {
    id: 'vibration2-3',
    x: convertX(685),
    y: convertY(130),
    name: '진동감지기3',
  },
];

// 진동감지기 위험 임계값 상수
const VIBRATION_DANGER_THRESHOLD = 500;

const FACILITY_DETAIL: FacilityDetail = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/monitoring/facility1.jpg',
  operationHours: '09:00 ~ 18:00',
  capacity: '250kg/일',
  pressure: '700bar',
  sensors: {
    gas: [
      { id: 1, name: '가스감지기1', status: '--' },
      { id: 2, name: '가스감지기2', status: '--' },
      { id: 3, name: '가스감지기3', status: '--' },
      { id: 4, name: '가스감지기4', status: '--' },
      { id: 5, name: '가스감지기5', status: '--' },
      { id: 6, name: '가스감지기6', status: '--' },
      { id: 7, name: '가스감지기7', status: '--' },
      { id: 8, name: '가스감지기8', status: '--' },
    ],
    fire: [
      { id: 9, name: '화재감지기1', status: '--' },
      { id: 10, name: '화재감지기2', status: '--' },
      { id: 11, name: '화재감지기3', status: '--' },
    ],
    vibration: [
      {
        id: 12,
        name: '진동감지기1',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 13,
        name: '진동감지기2',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 14,
        name: '진동감지기3',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
    ],
  },
};

// 색상 세트 타입 정의
type ChartColorSet = {
  line: string;
  fill: string;
};

// 모바일 여부를 감지하는 훅
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

// 지도+목록 넓게, 그래프 좁게 오버라이드
const LeftColumnWide = styled(LeftColumn)`
  width: 45% !important;
  min-width: 0;
  @media (max-width: 768px) {
    width: 100% !important;
    display: block;
  }
`;
const VibrationGraphContainerNarrow = styled(VibrationGraphContainerColumn)`
  width: 55% !important;
  min-width: 0;
  @media (max-width: 768px) {
    width: 100% !important;
    display: block;
  }
`;

export default function MonitoringDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ThemeProvider>
      <DetailPageContent params={params} />
    </ThemeProvider>
  );
}

function DetailPageContent({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [imageHeight, setImageHeight] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<VibrationSensor | null>(
    null
  );
  const [isDetailedGraphOpen, setIsDetailedGraphOpen] = useState(false);
  const [vibrationSensors, setVibrationSensors] = useState<VibrationSensor[]>(
    () =>
      FACILITY_DETAIL.sensors.vibration.map((sensor) => ({
        ...sensor,
        value: '0',
        status: '',
        data: [],
        detailedData: [],
      }))
  );
  const [gasStatus, setGasStatus] = useState<number | null>(null);
  const [fireStatus, setFireStatus] = useState<number | null>(null);
  const [gasStatusArr, setGasStatusArr] = useState<number[]>([]);
  const [fireStatusArr, setFireStatusArr] = useState<number[]>([]);

  const handleWebSocketMessage = useCallback(
    async (data: any) => {
      // 전체 데이터 구조 로깅
      console.log('📡 수신된 WebSocket 데이터:', {
        topic_id: data?.mqtt_data?.topic_id,
        last_update_time: data?.mqtt_data?.data?.last_update_time,
        barr: data?.mqtt_data?.data?.barr,
      });

      // 삼척수소충전소(P003) 데이터만 처리, 그 외는 무시
      if (data?.mqtt_data?.topic_id !== 'BASE/P003') {
        return;
      }

      // 삼척수소충전소(P003) 데이터 처리
      try {
        const barrString = data.mqtt_data.data.barr;
        const lastUpdateTime = data.mqtt_data.data.last_update_time;
        if (!barrString) {
          console.warn('⚠️ barr 데이터가 없음');
          return;
        }
        const barrValues = barrString
          .split(',')
          .slice(0, 3)
          .map((value: string) => parseInt(value));
        if (barrValues.length !== 3) {
          console.warn('⚠️ barr 데이터 길이가 잘못됨:', barrValues.length);
          return;
        }
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        setVibrationSensors((prevSensors) =>
          prevSensors.map((sensor, index) => {
            if (index < 3) {
              const value = barrValues[index];
              const newDataPoint = {
                time: timeStr,
                value: value,
              };
              const newDetailedDataPoint = {
                time: timeStr,
                timestamp: now.getTime(),
                value: value,
              };
              // 변환값 및 임계값 기준으로 위험 판정
              const converted = plcToMms(value, sensor.name);
              const threshold = getVibrationThreshold(
                getVibrationSensorKey(sensor)
              );
              const status =
                !isNaN(converted) && converted >= threshold
                  ? 'danger'
                  : 'normal';
              if (status === 'danger') {
                console.log(
                  '⚠️ 위험 감지:',
                  sensor.name,
                  'converted:',
                  converted,
                  'threshold:',
                  threshold
                );
                // 상세1과 동일하게 로그 추가
                let unit = 'mm/s';
                if (sensor.name === '진동감지기1') unit = 'm/s²'; // 필요시 센서별 단위 분기
                addLogItem(
                  sensor,
                  status,
                  '진동',
                  `${converted.toFixed(2)} ${unit}`
                );
                // Toast 알림 추가
                setDangerToast({
                  sensor: sensor.name,
                  value: `${converted.toFixed(2)} ${unit}`,
                });
              }
              return {
                ...sensor,
                value: value.toString(),
                status: status,
                data: [...sensor.data.slice(-99), newDataPoint],
                detailedData: [
                  ...sensor.detailedData.slice(-299),
                  newDetailedDataPoint,
                ],
              };
            }
            return sensor;
          })
        );
        // 가스/화재 데이터 처리
        const gdet = data.mqtt_data.data.gdet;
        const fdet = data.mqtt_data.data.fdet;
        if (typeof gdet !== 'undefined') setGasStatus(gdet);
        if (typeof fdet !== 'undefined') setFireStatus(fdet);
        const gdetArr = Array.isArray(gdet)
          ? gdet
          : typeof gdet === 'string'
          ? gdet.split(',').map(Number)
          : [];
        setGasStatusArr(gdetArr);
        // 가스 위험 이벤트 트리거
        gdetArr.forEach((val, idx) => {
          if (val === 1) {
            addLogItem(
              FACILITY_DETAIL.sensors.gas[idx],
              'danger',
              '가스',
              '위험 감지'
            );
            setDangerToast({
              sensor: FACILITY_DETAIL.sensors.gas[idx].name,
              value: '위험 감지',
            });
          }
        });
        const fdetArr = Array.isArray(fdet)
          ? fdet
          : typeof fdet === 'string'
          ? fdet.split(',').map(Number)
          : typeof fdet === 'number'
          ? [fdet]
          : [];
        setFireStatusArr(fdetArr);
        // 화재 위험 이벤트 트리거
        fdetArr.forEach((val, idx) => {
          if (val === 1) {
            addLogItem(
              FACILITY_DETAIL.sensors.fire[idx],
              'danger',
              '화재',
              '위험 감지'
            );
            setDangerToast({
              sensor: FACILITY_DETAIL.sensors.fire[idx].name,
              value: '위험 감지',
            });
          }
        });
        // 한국표준시로 년/월/일 제외하고 시간 포맷팅
        const updateDate = new Date(lastUpdateTime);
        if (!isNaN(updateDate.getTime())) {
          // UTC+9 시간으로 변환 (한국표준시)
          const kstDate = new Date(updateDate.getTime() + 9 * 60 * 60 * 1000);
          const formattedTime = kstDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          setLastUpdateTime(formattedTime);
        } else {
          setLastUpdateTime(lastUpdateTime);
        }
      } catch (error) {
        console.error('❌ 삼척수소충전소(P003) 데이터 처리 중 오류:', error);
      }
    },
    [vibrationSensors]
  );

  useWebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev',
    handleWebSocketMessage
  );

  const [selectedSensorType, setSelectedSensorType] = useState<
    'all' | 'gas' | 'fire' | 'vibration'
  >('all');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipSensor, setTooltipSensor] = useState<{
    id: string;
    name: string;
    status: '정상' | '경고' | '위험' | '--';
    value?: string;
    unit?: string;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animationDelays, setAnimationDelays] = useState<
    Record<string, number>
  >({});
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logItems, setLogItems] = useState<
    Array<{
      time: string;
      sensorName: string;
      type: '진동' | '가스' | '화재';
      status: 'warning' | 'danger';
      value?: string;
      unit?: string;
    }>
  >([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomDomain, setZoomDomain] = useState<{
    x: [number, number];
    y: [number, number];
  } | null>(null);
  const [isZooming] = useState(true);
  const [aspectRatio] = useState(357 / 1920);
  const [mapHeight, setMapHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [tooltipWindowPos, setTooltipWindowPos] = useState({ x: 0, y: 0 });

  // 색상 세트를 랜덤하게 섞어서 배분
  const [colorAssignments] = useState<Record<string, ChartColorSet>>(() => {
    return vibrationSensors.reduce((acc, sensor, index) => {
      // 1번 진동감지기: 주황
      if (index === 0) {
        acc[sensor.id.toString()] = {
          line: '#FB8B24', // 주황
          fill: '#FB8B24',
        };
      }
      // 2, 3번: 초록
      else if (index === 1 || index === 2) {
        acc[sensor.id.toString()] = {
          line: '#04A777',
          fill: '#04A777',
        };
      }
      return acc;
    }, {} as Record<string, ChartColorSet>);
  });

  const formatTime = useCallback((date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  const handleGraphClick = (sensor: VibrationSensor) => {
    setSelectedSensor(sensor);
    setIsDetailedGraphOpen(true);
  };

  const closeDetailedGraph = () => {
    setIsDetailedGraphOpen(false);
    setSelectedSensor(null);
  };
  // 1️⃣ 센서별 변환 함수 (상세1과 동일하게 id/name 기반)
  const plcToMms = (value: number, sensorId?: string | number) => {
    const clamped = Math.max(0, Math.min(4000, Number(value)));

    // 진동감지기1 (0~19.6 m/s²)
    if (
      sensorId === '진동감지기1' ||
      sensorId === 'vibration2-1' ||
      sensorId === 12 ||
      sensorId === '12'
    ) {
      return (clamped / 4000) * 19.6;
    }
    // 진동감지기2 (0~50 mm/s)
    if (
      sensorId === '진동감지기2' ||
      sensorId === 'vibration2-2' ||
      sensorId === 13 ||
      sensorId === '13'
    ) {
      return (clamped / 4000) * 50;
    }
    // 진동감지기3 (0~50 mm/s)
    if (
      sensorId === '진동감지기3' ||
      sensorId === 'vibration2-3' ||
      sensorId === 14 ||
      sensorId === '14'
    ) {
      return (clamped / 4000) * 50;
    }
    // 예외: 혹시 모를 기타 센서
    return clamped * 0.025;
  };

  // 위험 판정 함수: 항상 sensor.id 기준으로만 비교
  const getSensorStatus = (
    sensorOrId: any
  ): 'normal' | 'warning' | 'danger' => {
    if (!sensorOrId) return 'normal';
    let sensor: VibrationSensor | GasSensor | FireSensor | undefined =
      undefined;
    if (typeof sensorOrId === 'string') {
      // id로 센서 객체 찾기 (vibrationSensors, FACILITY_DETAIL.sensors.gas/fire에서)
      sensor =
        vibrationSensors.find((s) => String(s.id) === sensorOrId) ||
        FACILITY_DETAIL.sensors.gas.find((s) => String(s.id) === sensorOrId) ||
        FACILITY_DETAIL.sensors.fire.find((s) => String(s.id) === sensorOrId);
      if (!sensor) return 'normal';
    } else {
      sensor = sensorOrId;
      if (!sensor) return 'normal';
      if (!('name' in sensor) || !('status' in sensor)) return 'normal';
    }
    // 진동센서(vibration, vibration2 모두)
    if (
      'name' in sensor &&
      (sensor.name.startsWith('진동감지기') ||
        String(sensor.id).startsWith('vibration'))
    ) {
      const threshold = getVibrationThreshold(getVibrationSensorKey(sensor));
      if (
        'value' in sensor &&
        typeof sensor.value !== 'undefined' &&
        sensor.value !== null &&
        sensor.value !== ''
      ) {
        const plcVal = Number(sensor.value);
        const converted = plcToMms(plcVal, sensor.name);
        if (!isNaN(converted) && converted >= threshold) return 'danger';
      }
      return 'normal';
    }
    // 가스센서
    if ('name' in sensor && sensor.name.startsWith('가스감지기')) {
      const gIdx = parseInt(sensor.name.replace('가스감지기', '')) - 1;
      if (typeof gasStatusArr[gIdx] === 'number') {
        if (gasStatusArr[gIdx] === 1) return 'danger';
      }
      return 'normal';
    }
    // 화재센서
    if ('name' in sensor && sensor.name.startsWith('화재감지기')) {
      const fIdx = parseInt(sensor.name.replace('화재감지기', '')) - 1;
      if (typeof fireStatusArr[fIdx] === 'number') {
        if (fireStatusArr[fIdx] === 1) return 'danger';
      }
      return 'normal';
    }
    return 'normal';
  };

  const filteredSensors = useMemo(() => {
    let sensors: (GasSensor | FireSensor | VibrationSensor)[] = [];
    if (selectedSensorType === 'all') {
      sensors = [
        ...FACILITY_DETAIL.sensors.gas,
        ...FACILITY_DETAIL.sensors.fire,
        ...vibrationSensors,
      ];
    } else if (selectedSensorType === 'gas') {
      sensors = FACILITY_DETAIL.sensors.gas;
    } else if (selectedSensorType === 'fire') {
      sensors = FACILITY_DETAIL.sensors.fire;
    } else {
      sensors = vibrationSensors;
    }
    // 위험 센서가 최상단에 오도록 정렬 (센서 객체 자체로 판정)
    return sensors.slice().sort((a, b) => {
      const aStatus = getSensorStatus(getFullSensor(a));
      const bStatus = getSensorStatus(getFullSensor(b));
      if (aStatus === 'danger' && bStatus !== 'danger') return -1;
      if (aStatus !== 'danger' && bStatus === 'danger') return 1;
      return 0;
    });
  }, [selectedSensorType, vibrationSensors, gasStatusArr, fireStatusArr]);

  const getSensorInfo = (sensorId: string) => {
    const type = sensorId.split('-')[0];
    // 진동센서(vibration, vibration2 모두)
    if (type === 'vibration' || type === 'vibration2') {
      const sensorIndex = parseInt(sensorId.split('-')[1]) - 1;
      const sensor = vibrationSensors[sensorIndex];
      let signalText = '--';
      let realtimeValue = '--';
      if (
        sensor &&
        typeof sensor.value !== 'undefined' &&
        sensor.value !== null &&
        sensor.value !== ''
      ) {
        realtimeValue = sensor.value;
        const plcVal = Number(sensor.value);
        const converted = plcToMms(plcVal, sensor.name);
        const threshold = getVibrationThreshold(
          sensor.id ? String(sensor.id) : sensorId
        );
        if (!isNaN(converted)) {
          signalText = converted >= threshold ? '위험' : '정상';
        }
      }
      return {
        name: sensor?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '경고' | '위험' | '--',
      };
    } else if (type === 'gas') {
      const idx = parseInt(sensorId.split('-')[1]) - 1;
      const value = gasStatusArr[idx];
      let signalText = '--';
      let realtimeValue = '--';
      if (typeof value === 'number') {
        realtimeValue = value.toString();
        signalText = value === 1 ? '위험' : value === 0 ? '정상' : '--';
      }
      return {
        name: FACILITY_DETAIL.sensors.gas[idx]?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '위험' | '--',
      };
    } else if (type === 'fire') {
      const idx = parseInt(sensorId.split('-')[1]) - 1;
      const value = fireStatusArr[idx];
      let signalText = '--';
      let realtimeValue = '--';
      if (typeof value === 'number') {
        realtimeValue = value.toString();
        signalText = value === 1 ? '위험' : value === 0 ? '정상' : '--';
      }
      return {
        name: FACILITY_DETAIL.sensors.fire[idx]?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '위험' | '--',
      };
    } else {
      return {
        name: '',
        value: '--',
        status: '--' as '정상' | '경고' | '위험' | '--',
      };
    }
  };

  const handleSensorClick = (sensorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.currentTarget as Element;
    const rect = target.getBoundingClientRect();
    const mapContainer = document.querySelector('.map-container');
    const mapRect = mapContainer?.getBoundingClientRect();

    if (mapRect) {
      const x = rect.left - mapRect.left + rect.width / 2;
      const y = rect.top - mapRect.top;

      setTooltipPosition({ x, y });

      if (selectedSensorId === sensorId) {
        setSelectedSensorId(null);
        setShowTooltip(false);
        setTooltipSensor(null);
      } else {
        setSelectedSensorId(sensorId);
        setShowTooltip(true);

        const sensorInfo = getSensorInfo(sensorId);
        setTooltipSensor({
          id: sensorId,
          name: sensorInfo.name,
          status: sensorInfo.status,
          value: sensorInfo.value,
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedSensorId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 필터 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 센서 타입별 개수 계산
  const sensorCounts = useMemo(() => {
    return {
      all: [...GAS_SENSORS, ...FIRE_SENSORS, ...VIBRATION_SENSORS].length,
      gas: GAS_SENSORS.length,
      fire: FIRE_SENSORS.length,
      vibration: VIBRATION_SENSORS.length,
    };
  }, []);

  // hasDanger: 항상 sensor.status 기준
  const hasDanger = useMemo(() => {
    // 진동센서 위험
    const vibrationDanger = vibrationSensors.some(
      (sensor) => sensor.status === 'danger'
    );
    // 가스 위험
    const gasDanger = gasStatusArr.some((val) => val === 1);
    // 화재 위험
    const fireDanger = fireStatusArr.some((val) => val === 1);
    return vibrationDanger || gasDanger || fireDanger;
  }, [vibrationSensors, gasStatusArr, fireStatusArr]);

  // 필터링된 센서 아이콘 계산
  const filteredSensorIcons = useMemo(() => {
    let sensors: { id: string; x: number; y: number; name: string }[] = [];
    if (selectedSensorType === 'all') {
      sensors = [...GAS_SENSORS, ...FIRE_SENSORS, ...VIBRATION_SENSORS];
    } else if (selectedSensorType === 'gas') {
      sensors = GAS_SENSORS;
    } else if (selectedSensorType === 'fire') {
      sensors = FIRE_SENSORS;
    } else {
      sensors = VIBRATION_SENSORS;
    }
    // 센서 상태 비교 시 id 매핑을 일치시켜 danger 상태가 정확히 반영되도록 수정
    const dangerIcons = sensors.filter((sensor) => {
      // 진동센서만 id 매핑으로 status 판정
      if (sensor.name.startsWith('진동감지기')) {
        const matched = vibrationSensors.find(
          (vs) => getVibrationSensorKey(vs) === sensor.id
        );
        const status = matched?.status ?? 'normal';
        return status === 'danger';
      }
      // 가스/화재 센서는 getSensorStatus로 판정
      return getSensorStatus(getFullSensor(sensor)) === 'danger';
    });
    if (dangerIcons.length > 0) {
      return dangerIcons;
    }
    return sensors;
  }, [selectedSensorType, vibrationSensors, gasStatusArr, fireStatusArr]);

  // 컴포넌트가 마운트될 때 한 번만 애니메이션 딜레이 계산
  useEffect(() => {
    const delays = filteredSensorIcons.reduce((acc, sensor) => {
      acc[sensor.id.toString()] = Math.random() * 1.5;
      return acc;
    }, {} as Record<string, number>);
    setAnimationDelays(delays);
  }, []);

  // 로그 아이템 추가 함수
  const addLogItem = useCallback(
    (
      sensor: any,
      status: 'warning' | 'danger',
      type: '진동' | '가스' | '화재',
      value: string
    ) => {
      const now = new Date();
      const time = formatTime(now);
      setLogItems((prev) => [
        {
          time,
          sensorName: sensor.name,
          type,
          status,
          value,
        },
        ...prev,
      ]);
    },
    [formatTime]
  );

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    yaxis: {
      min: 0,
      max: Math.max(
        ...vibrationSensors.map((s) =>
          Math.max(...s.data.map((d: VibrationDataPoint) => d.value))
        )
      ),
    },
  };

  const handleMouseDown = (e: any) => {
    if (!e || !isZooming || !selectedSensor) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (!e || !isZooming || !selectedSensor) return;
    if (refAreaLeft) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (!refAreaLeft || !refAreaRight || !isZooming || !selectedSensor) return;

    const leftIndex = selectedSensor.detailedData.findIndex(
      (d) => d.timestamp === Number(refAreaLeft)
    );
    const rightIndex = selectedSensor.detailedData.findIndex(
      (d) => d.timestamp === Number(refAreaRight)
    );

    if (Math.abs(leftIndex - rightIndex) < 5) {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let [left, right] = [Number(refAreaLeft), Number(refAreaRight)].sort();
    const dataPoints = selectedSensor.detailedData.filter(
      (d) => d.timestamp >= left && d.timestamp <= right
    );

    if (dataPoints.length > 0) {
      const yMin = Math.min(...dataPoints.map((d) => d.value));
      const yMax = Math.max(...dataPoints.map((d) => d.value));

      setZoomDomain({
        x: [left, right] as [number, number],
        y: [Math.max(0, yMin - 0.1), Math.min(2, yMax + 0.1)] as [
          number,
          number
        ],
      });
    }

    setRefAreaLeft('');
    setRefAreaRight('');
  };

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      if (!isDetailedGraphOpen || !selectedSensor || !isZooming) return;

      e.preventDefault();

      // 휠 위로(업) = 줌인, 휠 아래로(다운) = 줌아웃
      const isZoomIn = e.deltaY < 0;

      if (!zoomDomain) {
        const dataPoints = selectedSensor.detailedData;
        const initialDomain = {
          x: [
            dataPoints[0].timestamp,
            dataPoints[dataPoints.length - 1].timestamp,
          ] as [number, number],
          y: [0, 2] as [number, number],
        };
        setZoomDomain(initialDomain);
        return;
      }

      // x축 줌만 동작
      const dataPoints = selectedSensor.detailedData;
      const currentStartIdx = dataPoints.findIndex(
        (d) => d.timestamp === Number(zoomDomain.x[0])
      );
      const currentEndIdx = dataPoints.findIndex(
        (d) => d.timestamp === Number(zoomDomain.x[1])
      );

      if (currentStartIdx !== -1 && currentEndIdx !== -1) {
        const currentRange = currentEndIdx - currentStartIdx;
        // 휠 업(줌인): 0.8, 휠 다운(줌아웃): 1.2
        const zoomFactor = isZoomIn ? 0.8 : 1.2;
        const newRange = Math.round(currentRange * zoomFactor);

        const centerIdx = Math.round((currentStartIdx + currentEndIdx) / 2);
        const newStartIdx = Math.max(0, centerIdx - Math.round(newRange / 2));
        const newEndIdx = Math.min(
          dataPoints.length - 1,
          centerIdx + Math.round(newRange / 2)
        );

        if (newStartIdx >= 0 && newEndIdx < dataPoints.length) {
          const newDomain = {
            ...zoomDomain,
            x: [
              dataPoints[newStartIdx].timestamp,
              dataPoints[newEndIdx].timestamp,
            ] as [number, number],
          };
          setZoomDomain(newDomain);
        }
      }
    };

    const graphContainer = document.querySelector('.detailed-graph-container');
    if (graphContainer) {
      graphContainer.addEventListener(
        'wheel',
        handleWheelEvent as EventListener,
        { passive: false }
      );
    }

    return () => {
      if (graphContainer) {
        graphContainer.removeEventListener(
          'wheel',
          handleWheelEvent as EventListener
        );
      }
    };
  }, [isDetailedGraphOpen, selectedSensor, zoomDomain, isZooming]);

  // 줌 초기화 함수 수정
  const resetZoom = useCallback(() => {
    if (!selectedSensor) return;

    const dataPoints = selectedSensor.detailedData;
    if (dataPoints.length === 0) return;

    // Y축 범위를 데이터의 최소/최대값 기준으로 설정
    const values = dataPoints.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.1; // 10% 여유 공간

    setZoomDomain({
      x: [
        dataPoints[0].timestamp,
        dataPoints[dataPoints.length - 1].timestamp,
      ] as [number, number],
      y: [Math.max(0, minValue - padding), maxValue + padding] as [
        number,
        number
      ],
    });
  }, [selectedSensor]);

  // 상세 그래프가 열릴 때 초기 줌 도메인 설정
  useEffect(() => {
    if (isDetailedGraphOpen && selectedSensor) {
      resetZoom();
    }
  }, [isDetailedGraphOpen, selectedSensor, resetZoom]);

  // 팝업 하단 통계 계산 수정
  const graphStats = useMemo(() => {
    if (!selectedSensor?.detailedData?.length) {
      return {
        fromTime: '-',
        toTime: '-',
        maxValue: '-',
        minValue: '-',
        avgValue: '-',
      };
    }

    const data = selectedSensor.detailedData;
    const values = data.map((d) => d.value);

    return {
      fromTime: data[0]?.time || '-',
      toTime: data[data.length - 1]?.time || '-',
      maxValue: Math.max(...values).toFixed(0),
      minValue: Math.min(...values).toFixed(0),
      avgValue: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(0),
    };
  }, [selectedSensor]);

  // 센서 이름으로 센서 배열에서 id를 찾아 반환하는 함수
  function getSensorDomId(
    sensor: GasSensor | FireSensor | VibrationSensor
  ): string {
    if (sensor.name.startsWith('가스감지기')) {
      const found = GAS_SENSORS.find((s) => s.name === sensor.name);
      return found ? found.id : '';
    } else if (sensor.name.startsWith('화재감지기')) {
      const found = FIRE_SENSORS.find((s) => s.name === sensor.name);
      return found ? found.id : '';
    } else if (sensor.name.startsWith('진동감지기')) {
      const found = VIBRATION_SENSORS.find((s) => s.name === sensor.name);
      return found ? found.id : '';
    }
    return '';
  }

  // 센서 목록 클릭 시 툴팁 정확히 뜨도록 id 매핑 개선
  const handleSensorListItemClick = (
    sensor: GasSensor | FireSensor | VibrationSensor
  ) => {
    // 센서 이름으로 정확한 id 생성
    const sensorId = getSensorDomId(sensor);
    const sensorIcon = document.querySelector(`[data-sensor-id="${sensorId}"]`);
    const mapContainer = document.querySelector('.map-container');

    if (sensorIcon && mapContainer) {
      const rect = sensorIcon.getBoundingClientRect();
      const mapRect = mapContainer.getBoundingClientRect();
      const x = rect.left - mapRect.left + rect.width / 2;
      const y = rect.top - mapRect.top;
      setTooltipPosition({ x, y });
      setSelectedSensorId(sensorId);
      setShowTooltip(true);
      const sensorInfo = getSensorInfo(sensorId);
      setTooltipSensor({
        id: sensorId,
        name: sensorInfo.name,
        status: sensorInfo.status,
        value: sensorInfo.value,
      });
      // sensorIcon.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // CSV 다운로드 함수
  function handleDownloadCsv() {
    if (!selectedSensor?.detailedData?.length) return;
    const header = 'time,timestamp,value\n';
    const rows = selectedSensor.detailedData
      .map((d) => `${d.time},${d.timestamp},${d.value}`)
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSensor.name}_상세그래프.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 모바일 여부
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 센서별 signalText 계산 함수(중복 로직 함수화)
  function signalTextForSensor(sensor: any) {
    let signalText = '--';
    let gIdx, fIdx;
    if (sensor.name.startsWith('가스감지기')) {
      gIdx = parseInt(sensor.name.replace('가스감지기', '')) - 1;
      if (typeof gasStatusArr[gIdx] === 'number') {
        signalText =
          gasStatusArr[gIdx] === 1
            ? '위험'
            : gasStatusArr[gIdx] === 0
            ? '정상'
            : '--';
      }
    } else if (sensor.name.startsWith('화재감지기')) {
      fIdx = parseInt(sensor.name.replace('화재감지기', '')) - 1;
      if (typeof fireStatusArr[fIdx] === 'number') {
        signalText =
          fireStatusArr[fIdx] === 1
            ? '위험'
            : fireStatusArr[fIdx] === 0
            ? '정상'
            : '--';
      }
    } else if (sensor.name.includes('진동')) {
      if (
        typeof sensor.value !== 'undefined' &&
        sensor.value !== null &&
        sensor.value !== ''
      ) {
        const plcVal = Number(sensor.value);
        const converted = plcToMms(plcVal, sensor.name);
        // 센서 id를 정확히 구해서 임계값과 비교
        const sensorId = getSensorDomId(sensor);
        const threshold = getVibrationThreshold(sensorId);
        if (!isNaN(converted)) {
          signalText = converted >= threshold ? '위험' : '정상';
        }
      }
    }
    return signalText;
  }

  // 위험상황일 때 danger 센서 id 배열 구하기
  const dangerSensorIds = useMemo(() => {
    return (filteredSensorIcons as any[])
      .filter(
        (sensor) => getSensorStatus(getFullSensor(sensor as any)) === 'danger'
      )
      .map((sensor) => sensor.id);
  }, [filteredSensorIcons, vibrationSensors]);

  const [showAlarmPermission, setShowAlarmPermission] = useState(true);
  const [alarmAllowed, setAlarmAllowed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 위험상황 감지 useEffect
  useEffect(() => {
    if (alarmAllowed && hasDanger && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [hasDanger, alarmAllowed]);

  // GNB(상단 네비게이션 바) 높이 구하기
  const gnbRef = useRef<HTMLDivElement>(null);
  const [gnbHeight, setGnbHeight] = useState(0);
  useEffect(() => {
    if (gnbRef.current) {
      setGnbHeight(gnbRef.current.offsetHeight);
    }
  }, [isMobile]);

  useEffect(() => {
    if (showTooltip && selectedSensorId) {
      const sensorIcon = document.querySelector(
        `[data-sensor-id="${selectedSensorId}"]`
      );
      if (sensorIcon) {
        const iconRect = sensorIcon.getBoundingClientRect();
        setTooltipWindowPos({
          x: iconRect.left + iconRect.width / 2,
          y: iconRect.top,
        });
      }
    }
  }, [showTooltip, selectedSensorId]);

  // 상태 추가
  const [showVibrationThresholdModal, setShowVibrationThresholdModal] =
    useState(false);

  // 팝업 AreaChart에 넘길 데이터 (상세1과 동일하게 변환값 적용)
  const chartData = useMemo(() => {
    if (!selectedSensor?.detailedData) return [];
    const id = selectedSensor.id;
    return selectedSensor.detailedData.map((d) => ({
      ...d,
      value: plcToMms(d.value, id),
    }));
  }, [selectedSensor]);

  // 진동 임계값 입력 팝업에서 사용할 센서 리스트 준비
  const vibrationSensorList = VIBRATION_SENSORS.map((s) => ({
    id: s.id,
    name: s.name,
  }));

  // 진동 임계값 입력값 상태 관리 (localStorage 연동)
  const [vibrationThresholdInputs, setVibrationThresholdInputs] = useState(
    () => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('vibrationThresholdInputs');
          if (saved) return JSON.parse(saved);
        } catch {}
      }
      // 기본값은 hooks의 VIBRATION_THRESHOLDS에서 가져옴
      return vibrationSensorList.reduce((acc, cur) => {
        acc[cur.id] = getVibrationThreshold(cur.id);
        return acc;
      }, {} as Record<string, number>);
    }
  );

  // 임계값 변경시 localStorage 저장
  const handleSetThresholds = (next: Record<string, number>) => {
    setVibrationThresholdInputs(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibrationThresholdInputs', JSON.stringify(next));
    }
  };

  // id 매핑 함수 추가
  function getVibrationSensorKey(sensor: { id: number; name: string }) {
    if (sensor.id === 12 || sensor.name === '진동감지기1')
      return 'vibration2-1';
    if (sensor.id === 13 || sensor.name === '진동감지기2')
      return 'vibration2-2';
    if (sensor.id === 14 || sensor.name === '진동감지기3')
      return 'vibration2-3';
    return String(sensor.id);
  }

  // 센서 아이콘 정보에서 전체 센서 객체로 변환하는 헬퍼 함수
  function getFullSensor(
    iconSensor: any
  ): VibrationSensor | GasSensor | FireSensor {
    if (!iconSensor)
      return {
        id: '',
        name: '',
        value: '',
        status: '',
        data: [],
        detailedData: [],
      } as unknown as VibrationSensor;
    if (iconSensor.name && iconSensor.name.startsWith('진동감지기')) {
      const found = vibrationSensors.find(
        (s) => String(s.id) === String(iconSensor.id)
      );
      if (found) return found;
      // 더미 VibrationSensor 객체 반환 (타입 안전성)
      return {
        id: iconSensor.id ?? '',
        name: iconSensor.name ?? '',
        value: '',
        status: '',
        data: [],
        detailedData: [],
      } as unknown as VibrationSensor;
    } else if (iconSensor.name && iconSensor.name.startsWith('가스감지기')) {
      const found = FACILITY_DETAIL.sensors.gas.find(
        (s) => String(s.id) === String(iconSensor.id)
      );
      if (found) return found;
      return {
        id: iconSensor.id ?? '',
        name: iconSensor.name ?? '',
        status: '',
        value: '',
      } as unknown as GasSensor;
    } else if (iconSensor.name && iconSensor.name.startsWith('화재감지기')) {
      const found = FACILITY_DETAIL.sensors.fire.find(
        (s) => String(s.id) === String(iconSensor.id)
      );
      if (found) return found;
      return {
        id: iconSensor.id ?? '',
        name: iconSensor.name ?? '',
        status: '',
        value: '',
      } as unknown as FireSensor;
    }
    // 타입 단언으로 타입 에러 우회
    return {
      id: iconSensor.id ?? '',
      name: iconSensor.name ?? '',
      value: '',
      status: '',
      data: [],
      detailedData: [],
    } as unknown as VibrationSensor;
  }

  // Toast 알림 상태 추가
  const [dangerToast, setDangerToast] = useState<{
    sensor: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    async function fetchInitialVibrationData() {
      console.log('Supabase fetch 시작!');
      const { data, error } = await supabase
        .from('realtime_data')
        .select('last_update_time, barr, gdet, fdet') // gdet, fdet 필드도 함께 쿼리
        .eq('topic_id', 'BASE/P003')
        .order('last_update_time', { ascending: false })
        .limit(100);
      console.log('supabase data:', data, error);
      if (!error && data) {
        // 센서별로 데이터 가공
        const sensors = FACILITY_DETAIL.sensors.vibration.map((sensor, idx) => {
          // sensorData를 reverse()로 뒤집어서 시간순 정렬
          const sensorData = data
            .map((row) => {
              const barrArr = String(row.barr || '').split(',');
              const value = isNaN(Number(barrArr[idx]))
                ? 0
                : parseInt(barrArr[idx] || '0', 10);
              const date = new Date(row.last_update_time);
              const time = date.toLocaleTimeString('ko-KR', { hour12: false });
              return {
                time,
                value,
                timestamp: date.getTime(),
              };
            })
            .reverse();
          return {
            ...sensor,
            value:
              sensorData.length > 0
                ? String(sensorData[sensorData.length - 1].value)
                : '0',
            data: sensorData.map((d) => ({ time: d.time, value: d.value })),
            detailedData: sensorData,
          };
        });
        setVibrationSensors(sensors);

        // 가스/화재 데이터 처리 추가
        if (data.length > 0) {
          const latestData = data[0];

          // 가스 상태 설정 - 직접 gdet 필드에서 가져옴
          if (latestData.gdet !== undefined) {
            const gdetArr = Array.isArray(latestData.gdet)
              ? latestData.gdet
              : typeof latestData.gdet === 'string'
              ? latestData.gdet.split(',').map(Number)
              : [];
            setGasStatusArr(gdetArr);
            setGasStatus(latestData.gdet);
          }

          // 화재 상태 설정 - 직접 fdet 필드에서 가져옴
          if (latestData.fdet !== undefined) {
            const fdetArr = Array.isArray(latestData.fdet)
              ? latestData.fdet
              : typeof latestData.fdet === 'string'
              ? latestData.fdet.split(',').map(Number)
              : typeof latestData.fdet === 'number'
              ? [latestData.fdet]
              : [];
            setFireStatusArr(fdetArr);
            setFireStatus(latestData.fdet);
          }

          // 최종 업데이트 시간 설정 (한국표준시, 년/월/일 제외)
          if (latestData.last_update_time) {
            const updateDate = new Date(latestData.last_update_time);
            if (!isNaN(updateDate.getTime())) {
              // UTC+9 시간으로 변환 (한국표준시)
              const kstDate = new Date(
                updateDate.getTime() + 9 * 60 * 60 * 1000
              );
              const formattedTime = kstDate.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              });
              setLastUpdateTime(formattedTime);
            } else {
              setLastUpdateTime(latestData.last_update_time);
            }
          }
        }
      }
    }
    fetchInitialVibrationData();
  }, []);

  return (
    <div>
      {/* 경보음 듣기 허용 팝업 */}
      {showAlarmPermission && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '36px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              textAlign: 'center',
              minWidth: 320,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
              경보음 듣기 허용
            </div>
            <div style={{ fontSize: 16, color: '#555', marginBottom: 28 }}>
              위험상황 발생 시 경보음을 자동으로 들으시겠습니까?
            </div>
            <button
              style={{
                background: '#ef4444',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setAlarmAllowed(true);
                setShowAlarmPermission(false);
              }}
            >
              허용
            </button>
          </div>
        </div>
      )}
      <TopBanner>
        <BannerBackground>
          <DarkOverlay />
        </BannerBackground>
        <GNB ref={gnbRef}>
          <Logo>
            <LogoImageWrapper>
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="32px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImageWrapper>
            <span>HyGE&nbsp;Safety&nbsp;Monitoring</span>
          </Logo>
          <BannerTitle>삼척 수소충전소</BannerTitle>
          {!isMobile && (
            <MainMenu>
              <ThemeToggleButton />
              {/* 진동 위험값 설정 버튼 - 상단배너 다른 버튼들과 동일한 색상/스타일 */}
              <button
                style={{
                  margin: '0 6px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: document.documentElement.classList.contains('dark')
                    ? 'rgba(255,255,255,0.7)'
                    : '#475569',
                  fontFamily: 'Pretendard',
                  fontSize: 15,
                  fontWeight: 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
                onClick={() => setShowVibrationThresholdModal(true)}
                onMouseOver={(e) => {
                  const isDark =
                    document.documentElement.classList.contains('dark');
                  e.currentTarget.style.color = isDark ? '#fff' : '#2563eb';
                }}
                onMouseOut={(e) => {
                  const isDark =
                    document.documentElement.classList.contains('dark');
                  e.currentTarget.style.color = isDark
                    ? 'rgba(255,255,255,0.7)'
                    : '#475569';
                }}
              >
                {/* 경고+설정 아이콘 */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 20h20L12 2z" fill="#FB8B24" opacity="0.18" />
                  <path
                    d="M12 8v4"
                    stroke="#FB8B24"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16" r="1.2" fill="#FB8B24" />
                  <g>
                    <circle
                      cx="18"
                      cy="6"
                      r="2"
                      fill="#fff"
                      stroke="#FB8B24"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 4.5v3M16.5 6h3"
                      stroke="#FB8B24"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
                진동값설정
              </button>
              <Link href="/" passHref legacyBehavior>
                <NavLinkStyle active={pathname === '/'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                  홈
                </NavLinkStyle>
              </Link>
              <Link
                href={`/monitoring/detail/${params.id}/tube-trailer`}
                passHref
                legacyBehavior
              >
                <NavLinkStyle
                  active={(pathname ?? '').includes('tube-trailer')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                    <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                    <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                  </svg>
                  튜브트레일러
                </NavLinkStyle>
              </Link>
              <LogButton as="button" onClick={() => setIsLogOpen(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                    clipRule="evenodd"
                  />
                </svg>
                경고 로그
              </LogButton>
              <NavLinkStyle
                as="button"
                onClick={() => router.push('/monitoring')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                전단계
              </NavLinkStyle>
              <UpdateTime>업데이트: {lastUpdateTime}</UpdateTime>
            </MainMenu>
          )}
        </GNB>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <LeftColumnWide>
            <MapView
              className={hasDanger ? 'danger' : ''}
              style={{
                width: '100%',
                height: isMounted ? `${mapHeight}px` : 'auto',
                overflow: 'hidden',
                maxWidth: '100vw',
              }}
            >
              <MapContainer
                className="map-container"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  maxWidth: '100vw',
                }}
                onClick={() => {
                  setShowTooltip(false);
                  setSelectedSensorId(null);
                  setTooltipSensor(null);
                }}
              >
                <svg
                  viewBox="0 0 828 672"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: 'auto' }}
                >
                  <image
                    href="/images/monitoring/detail/5bun.svg"
                    x="10%"
                    y="10%"
                    width="80%"
                    height="80%"
                    preserveAspectRatio="xMidYMid meet"
                  />
                  {filteredSensorIcons.map((sensor: any) => {
                    const fullSensor = getFullSensor(sensor);
                    const isDanger = getSensorStatus(fullSensor) === 'danger';
                    const isDimmed = dangerSensorIds.length > 0 && !isDanger;
                    // 센서별 위치 정보
                    const { x, y } = sensor;
                    return (
                      <g
                        key={sensor.id}
                        data-type={sensor.id.split('-')[0]}
                        data-sensor-id={sensor.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSensorClick(sensor.id, e);
                        }}
                        className={`sensor-icon${isDanger ? ' danger' : ''}${
                          isDimmed ? ' dimmed' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        transform={`translate(${x},${y})`}
                      >
                        {/* 1. danger 상태면 glow 원 먼저 */}
                        {isDanger && (
                          <circle
                            cx={0}
                            cy={0}
                            r={38}
                            fill="none"
                            stroke="#ff2d55"
                            strokeWidth={3}
                            opacity="0.25"
                            className="danger-glow"
                          />
                        )}
                        {/* 2. 아이콘 이미지는 항상 glow 위에 */}
                        <image
                          href={`/images/monitoring/detail/${
                            sensor.id.startsWith('vibration2-')
                              ? 'vibration_box'
                              : sensor.id.split('-')[0] + '_box'
                          }.svg`}
                          width="70"
                          height="70"
                          x={-35}
                          y={-35}
                          style={{ filter: 'drop-shadow(0 0 4px #fff)' }}
                        />
                        {/* 3. danger 상태면 느낌표 등 강조 요소 */}
                        {isDanger && (
                          <text
                            x="0"
                            y="-45"
                            textAnchor="middle"
                            fontSize="36"
                            fontWeight="bold"
                            fill="#fff700"
                            stroke="#ff2d55"
                            strokeWidth="2"
                            className="danger-shake"
                          >
                            !
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {/* 툴팁 등은 svg 바깥에서 렌더링 */}
                {showTooltip &&
                  tooltipSensor &&
                  typeof window !== 'undefined' &&
                  createPortal(
                    <SensorTooltip
                      status={
                        tooltipSensor.status === '정상'
                          ? 'normal'
                          : tooltipSensor.status === '경고'
                          ? 'warning'
                          : tooltipSensor.status === '위험'
                          ? 'danger'
                          : 'normal'
                      }
                      arrowDirection={
                        tooltipSensor.id === 'fire-2' ? 'up' : 'down'
                      }
                      style={{
                        position: 'fixed',
                        left: `${tooltipWindowPos.x}px`,
                        top: `${tooltipWindowPos.y}px`,
                        zIndex: 2000,
                        transform:
                          tooltipSensor.id === 'fire-2'
                            ? 'translate(-50%, 40px)'
                            : 'translate(-50%, -100%)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="tooltip-header">
                        <div className="status-indicator" />
                        <span className="name">{tooltipSensor.name}</span>
                        <span className="status-text">
                          {tooltipSensor.status}
                        </span>
                      </div>
                      <div className="tooltip-content">
                        <div className="info-row" data-role="value">
                          <span className="label">데이터</span>
                          <span className="value">
                            {(() => {
                              if (tooltipSensor.name.startsWith('진동감지기')) {
                                const vIdx =
                                  parseInt(
                                    tooltipSensor.name.replace('진동감지기', '')
                                  ) - 1;
                                const plcVal = Number(
                                  vibrationSensors[vIdx]?.value ?? ''
                                );
                                const plcRaw =
                                  vibrationSensors[vIdx]?.value ?? '';
                                if (!isNaN(plcVal) && plcRaw !== '') {
                                  const val = plcToMms(
                                    plcVal,
                                    tooltipSensor.name
                                  );
                                  const unit =
                                    tooltipSensor.name === '진동감지기1'
                                      ? 'm/s²'
                                      : 'mm/s';
                                  return `${plcRaw} → ${val.toFixed(
                                    2
                                  )} ${unit}`;
                                }
                              }
                              return tooltipSensor.value;
                            })()}
                          </span>
                        </div>
                        <div className="info-row" data-role="status">
                          <span className="label">상태</span>
                          <span className="value">
                            {tooltipSensor.status === '정상' ||
                            tooltipSensor.status === '경고' ||
                            tooltipSensor.status === '위험'
                              ? '연결됨'
                              : '연결안됨'}
                          </span>
                        </div>
                        <div className="info-row" data-role="updated">
                          <span className="label">업데이트</span>
                          <span className="value">
                            {lastUpdateTime
                              ? (() => {
                                  const d = new Date(lastUpdateTime);
                                  if (isNaN(d.getTime())) return lastUpdateTime;
                                  const MM = String(d.getMonth() + 1).padStart(
                                    2,
                                    '0'
                                  );
                                  const DD = String(d.getDate()).padStart(
                                    2,
                                    '0'
                                  );
                                  const hh = String(d.getHours()).padStart(
                                    2,
                                    '0'
                                  );
                                  const mm = String(d.getMinutes()).padStart(
                                    2,
                                    '0'
                                  );
                                  const ss = String(d.getSeconds()).padStart(
                                    2,
                                    '0'
                                  );
                                  return `${MM}/${DD} ${hh}:${mm}:${ss}`;
                                })()
                              : ''}
                          </span>
                        </div>
                      </div>
                    </SensorTooltip>,
                    document.body
                  )}
              </MapContainer>
              {hasDanger && (
                <>
                  {/* 지도 위 워터마크 삭제됨 */}
                  {/* 지도 전체 오버레이 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,0,0,0.18)',
                      zIndex: 9,
                      pointerEvents: 'none',
                      animation: 'danger-overlay-blink 0.7s infinite alternate',
                    }}
                  />
                </>
              )}
            </MapView>
            <SensorCard>
              <ListHeader>
                <span>번호</span>
                <span>종류</span>
                <span>연결상태</span>
                <span>신호</span>
                <span>데이터</span>
                <FilterDropdown className="filter-dropdown">
                  <FilterButton
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isOpen={isFilterOpen}
                  >
                    필터
                    <ChevronDown />
                  </FilterButton>
                  <FilterMenu isOpen={isFilterOpen}>
                    <FilterMenuItem
                      $active={selectedSensorType === 'all'}
                      onClick={() => {
                        setSelectedSensorType('all');
                        setIsFilterOpen(false);
                      }}
                    >
                      전체
                      <span className="count">{sensorCounts.all}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'gas'}
                      onClick={() => {
                        setSelectedSensorType('gas');
                        setIsFilterOpen(false);
                      }}
                    >
                      가스 센서
                      <span className="count">{sensorCounts.gas}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'fire'}
                      onClick={() => {
                        setSelectedSensorType('fire');
                        setIsFilterOpen(false);
                      }}
                    >
                      화재 센서
                      <span className="count">{sensorCounts.fire}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'vibration'}
                      onClick={() => {
                        setSelectedSensorType('vibration');
                        setIsFilterOpen(false);
                      }}
                    >
                      진동 센서
                      <span className="count">{sensorCounts.vibration}</span>
                    </FilterMenuItem>
                  </FilterMenu>
                </FilterDropdown>
              </ListHeader>
              <SensorList>
                {filteredSensors.map((sensor, index) => {
                  const id = sensor.name.startsWith('가스감지기')
                    ? `gas-${sensor.id}`
                    : sensor.name.startsWith('화재감지기')
                    ? `fire-${sensor.id - 15}`
                    : sensor.name.startsWith('진동감지기')
                    ? String(sensor.id)
                    : '';
                  const status = getSensorStatus(getFullSensor(sensor as any));
                  console.log(
                    '센서카드',
                    sensor.name,
                    'id:',
                    id,
                    'status:',
                    status
                  );
                  let realtimeValue = '--';
                  let signalText = '--';
                  let connectionText = '연결안됨';
                  let gIdx: number | undefined;
                  let fIdx: number | undefined;
                  let displayValue = '--';
                  let displayUnit = '';
                  let plcRawValue = '';
                  if (sensor.name.startsWith('진동감지기')) {
                    const vIdx =
                      parseInt(sensor.name.replace('진동감지기', '')) - 1;
                    if (
                      vibrationSensors[vIdx] &&
                      vibrationSensors[vIdx].value !== undefined &&
                      vibrationSensors[vIdx].value !== null &&
                      vibrationSensors[vIdx].value !== ''
                    ) {
                      connectionText = '연결됨';
                      // PLC값 → 변환값 + 단위
                      const plcVal = Number(vibrationSensors[vIdx].value);
                      plcRawValue = vibrationSensors[vIdx].value;
                      const val = plcToMms(plcVal, sensor.name);
                      displayValue =
                        typeof val === 'number' ? val.toFixed(2) : '--';
                      displayUnit =
                        sensor.name === '진동감지기1' ? 'm/s²' : 'mm/s';
                    }
                  } else if (sensor.name.startsWith('가스감지기')) {
                    gIdx = parseInt(sensor.name.replace('가스감지기', '')) - 1;
                    if (typeof gasStatusArr[gIdx] === 'number') {
                      connectionText = '연결됨';
                      displayValue = gasStatusArr[gIdx].toString();
                      displayUnit = '';
                    }
                  } else if (sensor.name.startsWith('화재감지기')) {
                    fIdx = parseInt(sensor.name.replace('화재감지기', '')) - 1;
                    if (typeof fireStatusArr[fIdx] === 'number') {
                      connectionText = '연결됨';
                      displayValue = fireStatusArr[fIdx].toString();
                      displayUnit = '';
                    }
                  }
                  if (sensor.name.startsWith('가스감지기')) {
                    const idx =
                      gIdx !== undefined
                        ? gIdx
                        : parseInt(sensor.name.replace('가스감지기', '')) - 1;
                    if (typeof gasStatusArr[idx] === 'number') {
                      realtimeValue = gasStatusArr[idx].toString();
                      signalText =
                        gasStatusArr[idx] === 1
                          ? '위험'
                          : gasStatusArr[idx] === 0
                          ? '정상'
                          : '--';
                    }
                  } else if (sensor.name.startsWith('화재감지기')) {
                    const idx =
                      fIdx !== undefined
                        ? fIdx
                        : parseInt(sensor.name.replace('화재감지기', '')) - 1;
                    if (typeof fireStatusArr[idx] === 'number') {
                      realtimeValue = fireStatusArr[idx].toString();
                      signalText =
                        fireStatusArr[idx] === 1
                          ? '위험'
                          : fireStatusArr[idx] === 0
                          ? '정상'
                          : '--';
                    }
                  } else if (sensor.name.includes('진동')) {
                    if (
                      typeof sensor.value !== 'undefined' &&
                      sensor.value !== null &&
                      sensor.value !== ''
                    ) {
                      realtimeValue = sensor.value;
                      const plcVal = Number(sensor.value);
                      const converted = plcToMms(plcVal, sensor.name);
                      // 센서 id를 정확히 구해서 임계값과 비교
                      const sensorId = getSensorDomId(sensor);
                      const threshold = getVibrationThreshold(sensorId);
                      if (!isNaN(converted)) {
                        signalText = converted >= threshold ? '위험' : '정상';
                      }
                    } else {
                      realtimeValue = '--';
                    }
                  }
                  return (
                    <SensorItem
                      key={sensor.id}
                      onClick={() => handleSensorListItemClick(sensor)}
                      className={status === 'danger' ? 'danger' : ''}
                    >
                      <SensorNo>{index + 1}</SensorNo>
                      <SensorType>
                        <span
                          className="sensor-name"
                          data-full-name={sensor.name}
                          data-short-name={sensor.name.replace(
                            /감지기(\d+)$/,
                            '#$1'
                          )}
                          style={{
                            color: sensor.name.startsWith('가스감지기')
                              ? '#04A777'
                              : sensor.name.startsWith('화재감지기')
                              ? '#D90368'
                              : sensor.name.startsWith('진동감지기')
                              ? '#FB8B24'
                              : undefined,
                            fontWeight: 700,
                          }}
                        />
                      </SensorType>
                      <SensorConnection>{connectionText}</SensorConnection>
                      <SensorStatus
                        status={signalText === '위험' ? 'danger' : 'normal'}
                      >
                        {signalText}
                      </SensorStatus>
                      <SensorValue
                        status={signalText === '위험' ? 'danger' : 'normal'}
                        style={{
                          textAlign: 'center',
                          width: 'auto',
                          minWidth: 120,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {sensor.name.startsWith('진동감지기') && plcRawValue ? (
                          <>
                            {plcRawValue}
                            <span style={{ color: '#222', margin: '0 2px' }}>
                              →
                            </span>
                            {displayValue}
                            <span style={{ color: '#222', marginLeft: 2 }}>
                              {displayUnit}
                            </span>
                          </>
                        ) : (
                          `${displayValue}${
                            displayUnit ? ` ${displayUnit}` : ''
                          }`
                        )}
                      </SensorValue>
                    </SensorItem>
                  );
                })}
              </SensorList>
            </SensorCard>
          </LeftColumnWide>
          <VibrationGraphContainerNarrow>
            {vibrationSensors.map((vibrationSensor, idx) => {
              let realtimeValue = '--';
              if (
                vibrationSensor.value !== undefined &&
                vibrationSensor.value !== null &&
                vibrationSensor.value !== ''
              ) {
                const plcVal = Number(vibrationSensor.value);
                const val = plcToMms(plcVal, vibrationSensor.name);
                const unit =
                  vibrationSensor.name === '진동감지기1' ? 'm/s²' : 'mm/s';
                realtimeValue = `${val.toFixed(2)} ${unit}`;
              }
              return (
                <VibrationGraphCard
                  key={vibrationSensor.id}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <h4
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      height: 40,
                    }}
                    onClick={() => {
                      // 지도 아이콘의 실제 DOM 위치를 찾아서 툴팁 위치를 맞춤
                      const sensorId = getSensorDomId(vibrationSensor);
                      const sensorIcon = document.querySelector(
                        `[data-sensor-id="${sensorId}"]`
                      );
                      const mapContainer =
                        document.querySelector('.map-container');
                      if (sensorIcon && mapContainer) {
                        const rect = sensorIcon.getBoundingClientRect();
                        const mapRect = mapContainer.getBoundingClientRect();
                        const x = rect.left - mapRect.left + rect.width / 2;
                        const y = rect.top - mapRect.top;
                        setTooltipPosition({ x, y });
                        setSelectedSensorId(sensorId);
                        setShowTooltip(true);
                        const sensorInfo = getSensorInfo(sensorId);
                        setTooltipSensor({
                          id: sensorId,
                          name: sensorInfo.name,
                          status: sensorInfo.status,
                          value: sensorInfo.value,
                        });
                      }
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {vibrationSensor.name}
                      {vibrationSensor.name === '진동감지기1'
                        ? ' (0~19.6m/s²)'
                        : ' (0~50mm/s)'}
                    </span>
                    <span
                      className="realtime-value"
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#222',
                        marginLeft: 12,
                        letterSpacing: 0.5,
                        minWidth: 70,
                        textAlign: 'right',
                      }}
                    >
                      {realtimeValue}
                    </span>
                    <span
                      className="status"
                      style={{
                        color:
                          vibrationSensor.status === 'danger'
                            ? '#ef4444'
                            : '#22c55e',
                        background:
                          vibrationSensor.status === 'danger'
                            ? '#fff0f0'
                            : '#f0fff4',
                        border:
                          vibrationSensor.status === 'danger'
                            ? '1px solid #ef4444'
                            : '1px solid #22c55e',
                        borderRadius: 8,
                        padding: '2px 12px',
                        fontWeight: 700,
                        marginLeft: 12,
                        fontSize: 15,
                        transition: 'all 0.2s',
                        minWidth: 48,
                        textAlign: 'center',
                        textShadow:
                          vibrationSensor.status === 'danger'
                            ? '0 1px 0 #fff, 0 0 2px #ef4444'
                            : undefined,
                        animation:
                          vibrationSensor.status === 'danger'
                            ? 'danger-blink 1s infinite alternate'
                            : undefined,
                      }}
                    >
                      {vibrationSensor.status === 'danger' ? '위험' : '정상'}
                    </span>
                  </h4>
                  <div
                    className="graph-container"
                    style={{ borderTop: '1px solid #e0e7ef' }}
                    onClick={() => handleGraphClick(vibrationSensor)}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={vibrationSensor.data.map((d) => ({
                          ...d,
                          value: plcToMms(d.value, vibrationSensor.id),
                        }))}
                        margin={{
                          top: 5,
                          right: 10,
                          left: -20,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-${vibrationSensor.id}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                colorAssignments[vibrationSensor.id.toString()]
                                  .line
                              }
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                colorAssignments[vibrationSensor.id.toString()]
                                  .line
                              }
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={colors.chart.grid.line}
                          opacity={colors.chart.grid.opacity}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: colors.chart.axis.line }}
                        />
                        <YAxis
                          domain={[
                            0,
                            Math.max(
                              ...vibrationSensor.data.map(
                                (d: VibrationDataPoint) =>
                                  plcToMms(d.value, vibrationSensor.name)
                              )
                            ),
                          ]}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: colors.chart.axis.line }}
                          tickFormatter={(value) =>
                            plcToMms(value, vibrationSensor.name).toFixed(2)
                          }
                          label={{
                            value:
                              vibrationSensor.name === '진동감지기1'
                                ? 'Acceleration (m/s²)'
                                : 'Velocity (mm/s)',
                            angle: -90,
                            position: 'insideLeft',
                            style: {
                              textAnchor: 'middle',
                              fontSize: 13,
                              fill: '#64748b',
                            },
                          }}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (
                              active &&
                              payload &&
                              payload.length &&
                              payload[0].value !== undefined
                            ) {
                              const val = payload[0].value;
                              const unit =
                                vibrationSensor.name === '진동감지기1'
                                  ? 'm/s²'
                                  : 'mm/s';
                              return (
                                <CustomTooltip>
                                  <div className="time">{label}</div>
                                  <div className="value">
                                    {typeof val === 'number'
                                      ? val.toFixed(2)
                                      : '--'}{' '}
                                    {unit}
                                  </div>
                                </CustomTooltip>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={
                            colorAssignments[vibrationSensor.id.toString()].line
                          }
                          strokeWidth={2}
                          fill={`url(#gradient-${vibrationSensor.id})`}
                          fillOpacity={1}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </VibrationGraphCard>
              );
            })}
          </VibrationGraphContainerNarrow>
        </MapSection>
      </ContentSection>

      <PopupOverlay isOpen={isDetailedGraphOpen} onClick={closeDetailedGraph} />
      <DetailedGraphPopup isOpen={isDetailedGraphOpen}>
        {selectedSensor && (
          <>
            <PopupHeader>
              <h2>{selectedSensor.name} 상세 그래프</h2>
              <div className="button-group">
                <PopupButton onClick={handleDownloadCsv}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  다운로드
                </PopupButton>
                {zoomDomain && (
                  <PopupButton onClick={resetZoom}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                        clipRule="evenodd"
                      />
                    </svg>
                    초기화
                  </PopupButton>
                )}
                <CloseButton onClick={closeDetailedGraph}>&times;</CloseButton>
              </div>
            </PopupHeader>
            <DetailedGraphContainer className="detailed-graph-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  <defs>
                    <linearGradient
                      id={`gradient-detailed`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="areaGlow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feFlood
                        floodColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        floodOpacity="0.2"
                      />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255, 255, 255, 0.1)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={zoomDomain?.x || ['dataMin', 'dataMax']}
                    allowDataOverflow
                    tickFormatter={(unixTime) => {
                      const date = new Date(unixTime);
                      return date.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      });
                    }}
                    stroke="rgba(255, 255, 255, 0.5)"
                    interval="preserveStartEnd"
                    minTickGap={50}
                  />
                  <YAxis
                    domain={(() => {
                      const values = selectedSensor.detailedData.map((d) =>
                        plcToMms(d.value, selectedSensor.id)
                      );
                      const validValues = values.filter(
                        (v) => typeof v === 'number' && !isNaN(v) && isFinite(v)
                      );
                      if (validValues.length === 0) return [0, 1];
                      const min = Math.min(...validValues);
                      const max = Math.max(...validValues);
                      if (!isFinite(min) || !isFinite(max) || min === max)
                        return [0, min + 1];
                      return [min, max];
                    })()}
                    allowDataOverflow
                    tickFormatter={(value) => value.toFixed(2)}
                    stroke="rgba(255, 255, 255, 0.5)"
                    label={{
                      value:
                        selectedSensor.name === '진동감지기1'
                          ? 'Acceleration (m/s²)'
                          : 'Velocity (mm/s)',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        textAnchor: 'middle',
                        fontSize: 13,
                        fill: '#cbd5e1',
                      },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (
                        active &&
                        payload &&
                        payload.length &&
                        payload[0].value !== undefined
                      ) {
                        const val = payload[0].value;
                        const isAccel = selectedSensor.name === '진동감지기1';
                        return (
                          <CustomTooltip>
                            <div className="time">
                              {(() => {
                                if (
                                  typeof label === 'string' &&
                                  /^\d{2}:\d{2}:\d{2}$/.test(label)
                                ) {
                                  return label;
                                }
                                const date = new Date(label);
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleTimeString('ko-KR', {
                                    hour12: false,
                                  });
                                }
                                return String(label);
                              })()}
                            </div>
                            <div className="value">
                              {typeof val === 'number' ? val.toFixed(2) : '--'}{' '}
                              {isAccel ? 'm/s²' : 'mm/s'}
                            </div>
                          </CustomTooltip>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colorAssignments[selectedSensor.id.toString()].line}
                    strokeWidth={3}
                    fill="url(#gradient-detailed)"
                    fillOpacity={1}
                    isAnimationActive={false}
                    dot={false}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{
                      filter: 'url(#areaGlow)',
                    }}
                  />
                  {isZooming && refAreaLeft && refAreaRight && (
                    <ReferenceArea
                      x1={refAreaLeft}
                      x2={refAreaRight}
                      strokeOpacity={0.3}
                      fill={colorAssignments[selectedSensor.id.toString()].line}
                      fillOpacity={0.1}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </DetailedGraphContainer>
            <GraphStatsBar>
              <span className="stat">From: {graphStats.fromTime}</span>
              <span className="stat">To: {graphStats.toTime}</span>
              <span className="stat">
                최대:{' '}
                {(() => {
                  const isAccel = selectedSensor.name === '진동감지기1';
                  return `${plcToMms(
                    Math.max(
                      ...selectedSensor.detailedData.map((d) => d.value)
                    ),
                    selectedSensor.id
                  ).toFixed(2)} ${isAccel ? 'm/s²' : 'mm/s'}`;
                })()}
              </span>
              <span className="stat">
                최소:{' '}
                {(() => {
                  const isAccel = selectedSensor.name === '진동감지기1';
                  return `${plcToMms(
                    Math.min(
                      ...selectedSensor.detailedData.map((d) => d.value)
                    ),
                    selectedSensor.id
                  ).toFixed(2)} ${isAccel ? 'm/s²' : 'mm/s'}`;
                })()}
              </span>
              <span className="stat">
                평균:{' '}
                {(() => {
                  const isAccel = selectedSensor.name === '진동감지기1';
                  const avg =
                    selectedSensor.detailedData.reduce(
                      (a, b) => a + b.value,
                      0
                    ) / selectedSensor.detailedData.length;
                  return `${plcToMms(avg, selectedSensor.id).toFixed(2)} ${
                    isAccel ? 'm/s²' : 'mm/s'
                  }`;
                })()}
              </span>
              <span className="legend">
                <span className="dot normal" /> 정상
                <span className="dot danger" /> 위험 (500 이상)
              </span>
            </GraphStatsBar>
          </>
        )}
      </DetailedGraphPopup>

      <LogPopup isOpen={isLogOpen}>
        <LogHeader>
          <h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
              style={{ marginRight: 8, verticalAlign: 'middle' }}
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
            경고 로그
          </h2>
          <CloseButton onClick={() => setIsLogOpen(false)}>&times;</CloseButton>
        </LogHeader>
        <LogContent>
          {logItems.map((item, index) => (
            <LogItem key={index} severity={item.status}>
              <span
                className="status"
                style={{ minWidth: 64, textAlign: 'center', marginRight: 20 }}
              >
                {item.status === 'warning' ? '경고' : '위험'}
              </span>
              <span className="time">{item.time}</span>
              <span className="content">{item.sensorName}</span>
              {item.value !== undefined &&
                (() => {
                  // 값과 단위 분리 (예: '31.41 mm/s' 또는 '15.2 m/s²')
                  const match = String(item.value).match(
                    /([\d.\-eE]+)\s*([a-zA-Z\/²μ]+)?/
                  );
                  if (match) {
                    const valuePart = match[1];
                    const unitPart = match[2] || '';
                    return (
                      <span className="value">
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>
                          {valuePart}
                        </span>
                        {unitPart ? (
                          <span style={{ color: '#222', marginLeft: 2 }}>
                            {unitPart}
                          </span>
                        ) : null}
                      </span>
                    );
                  }
                  return <span className="value">{item.value}</span>;
                })()}
            </LogItem>
          ))}
          {logItems.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#64748b',
                padding: '40px 0',
              }}
            >
              경고 또는 위험 상태의 센서가 없습니다.
            </div>
          )}
        </LogContent>
      </LogPopup>

      <PopupOverlay isOpen={isLogOpen} onClick={() => setIsLogOpen(false)} />

      {/* 경보음 */}
      <audio ref={audioRef} src="/alarm.mp3" loop style={{ display: 'none' }} />

      {/* 진동 위험값 설정 모달 */}
      <VibrationThresholdModal
        open={showVibrationThresholdModal}
        onClose={() => setShowVibrationThresholdModal(false)}
        thresholds={vibrationThresholdInputs}
        setThresholds={handleSetThresholds}
        sensors={vibrationSensorList}
      />
      {hasDanger && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 64,
            color: 'rgba(255,0,0,0.7)',
            fontWeight: 900,
            zIndex: 9999,
            pointerEvents: 'none',
            textShadow: '0 0 16px #fff, 0 0 32px #f00',
            animation: 'danger-text-blink 1s infinite alternate',
          }}
        >
          ⚠️ 위험 ⚠️
        </div>
      )}
      {hasDanger && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,0,0,0.15)',
            zIndex: 9998,
            pointerEvents: 'none',
            animation: 'danger-overlay-blink 0.7s infinite alternate',
          }}
        />
      )}
      {dangerToast && (
        <div
          style={{
            position: 'fixed',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            background: 'linear-gradient(90deg, #ff2d55 0%, #ffb347 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            padding: '18px 36px',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(255,45,85,0.18)',
            zIndex: 9999,
            letterSpacing: 1,
            minWidth: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ flex: 1, textAlign: 'center' }}>
            ⚠️ {dangerToast.sensor}에서 위험 감지! ({dangerToast.value})
          </span>
          <button
            onClick={() => setDangerToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 24,
              fontWeight: 900,
              marginLeft: 16,
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

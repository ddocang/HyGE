'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import FacilityInfoCard from './components/FacilityInfoCard';
import FacilityListItem from './components/FacilityListItem';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiShieldAlt2, BiGasPump, BiLogIn, BiUserPlus } from 'react-icons/bi';
import useWebSocket from '@/hooks/useWebSocket';
import { VIBRATION_THRESHOLDS } from '@/hooks/useVibrationThresholds';

// 더미 데이터
const DUMMY_FACILITY = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/monitoring/facility1.jpg',
};

const DUMMY_LIST = [
  {
    id: 1,
    name: '삼척 교동 수소 스테이션',
    address: '강원특별자치도 삼척시 교동 산 209',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '대체연료충전소',
    status: 'open',
    phone: '033-575-5189',
    imageUrl: '/images/monitoring/facility1.jpg',
  },
  {
    id: 2,
    name: '삼척 수소충전소',
    address: '강원특별자치도 삼척시 동해대로 3846',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-570-3391',
    imageUrl: '/images/monitoring/facility2.jpg',
  },
  {
    id: 3,
    name: '원주 수소충전소',
    address: '강원특별자치도 원주시 원문로 1320',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-734-4589',
    imageUrl: '/images/monitoring/facility3.jpg',
  },
  {
    id: 4,
    name: '속초 수소충전소',
    address: '강원특별자치도 속초시 동해대로 4521',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-636-3014',
    imageUrl: '/images/monitoring/facility4.jpg',
  },
  {
    id: 5,
    name: '동해 휴게소 수소충전소',
    address: '강원특별자치도 동해시 동해대로 6170',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-535-4891',
    imageUrl: '/images/monitoring/facility5.jpg',
  },
];

// 실시간 상태를 위한 타입
type FacilityStatus = {
  id: number;
  gasStatus: 'normal' | 'warning' | 'inactive';
  fireStatus: 'normal' | 'warning' | 'inactive';
  vibrationStatus: 'normal' | 'warning' | 'inactive';
};

// 진동 데이터 타입 정의
interface VibrationData {
  last_update_time: string;
  barr: string;
}

function VibrationDataFetcher() {
  const [data, setData] = useState<VibrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVibrationData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/supabase-vibration');
        const json = await res.json();
        if (res.ok) {
          setData(json.data);
        } else {
          setError(json.error || 'API 오류');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVibrationData();
  }, []);

  if (loading) return <div>진동 데이터 로딩 중...</div>;
  if (error) return <div>진동 데이터 에러: {error}</div>;

  return (
    <div
      style={{
        margin: '20px 0',
        padding: 12,
        background: '#f7f7f7',
        borderRadius: 8,
      }}
    >
      <h3>진동 데이터 (API Route 연동)</h3>
      <ul style={{ maxHeight: 200, overflowY: 'auto', fontSize: 14 }}>
        {data.map((item, idx) => (
          <li key={idx}>
            {item.last_update_time} - {item.barr}
          </li>
        ))}
      </ul>
    </div>
  );
}

// PLC값을 실제 단위로 변환하는 함수
function convertPLCtoRealValue(plcValue: number, key: string): number {
  if (plcValue === 65488) return NaN;
  // 진동 센서 1번: 0~10 mm/s
  if (key === 'vibration-1') return (plcValue / 4000) * 10;
  // 진동 센서 2번: 0~20 mm/s
  if (key === 'vibration-2') return (plcValue / 4000) * 20;
  // 진동 센서 3번: 0~30 mm/s
  if (key === 'vibration-3') return (plcValue / 4000) * 30;
  // 진동 센서 4번: 0~40 mm/s
  if (key === 'vibration-4') return (plcValue / 4000) * 40;
  // 진동 센서 5번: 0~50 mm/s
  if (key === 'vibration-5') return (plcValue / 4000) * 50;
  // 진동 센서 6번: 0~60 mm/s
  if (key === 'vibration-6') return (plcValue / 4000) * 60;
  // 진동 센서 7번 (가속도)
  if (key === 'vibration-7') return (plcValue / 4000) * 19.6;
  // 진동 센서 8, 9번
  if (key === 'vibration-8' || key === 'vibration-9')
    return (plcValue / 4000) * 50;
  // 진동2 센서들
  if (key === 'vibration2-1') return (plcValue / 4000) * 19.6;
  if (key === 'vibration2-2') return (plcValue / 4000) * 50;
  if (key === 'vibration2-3') return (plcValue / 4000) * 50;
  return plcValue;
}

// 가스 상태 계산 함수
const calculateGasStatus = (
  gdetData: string | undefined
): 'normal' | 'warning' | 'inactive' => {
  if (!gdetData) return 'inactive';
  const gdetArr = gdetData.split(',').map(Number);

  if (gdetArr.length && gdetArr.some((v) => v === 1)) return 'warning';
  if (gdetArr.length && gdetArr.every((v) => v === 0)) return 'normal';
  return 'inactive';
};

// 화재 상태 계산 함수
const calculateFireStatus = (
  fdetData: string | undefined
): 'normal' | 'warning' | 'inactive' => {
  if (!fdetData) return 'inactive';
  const fdetArr = fdetData.split(',').map(Number);

  if (fdetArr.length && fdetArr.some((v) => v === 1)) return 'warning';
  if (fdetArr.length && fdetArr.every((v) => v === 0)) return 'normal';
  return 'inactive';
};

// 진동 상태 계산 함수
const calculateVibrationStatus = (
  barrData: string | undefined,
  topicId: string
): 'normal' | 'warning' | 'inactive' => {
  if (!barrData) return 'inactive';
  const barrArr = barrData.split(',').map(Number);

  const vibrationKeys =
    topicId === 'BASE/P001'
      ? [
          'vibration-1',
          'vibration-2',
          'vibration-3',
          'vibration-4',
          'vibration-5',
          'vibration-6',
          'vibration-7',
          'vibration-8',
          'vibration-9',
        ]
      : topicId === 'BASE/P003'
      ? ['vibration2-1', 'vibration2-2', 'vibration2-3']
      : [];

  const vibrationStatuses = vibrationKeys.map((key, idx) => {
    const plcValue = barrArr[idx];
    const realValue = convertPLCtoRealValue(plcValue, key);
    const threshold = VIBRATION_THRESHOLDS[key]?.value;
    if (typeof realValue !== 'number' || isNaN(realValue)) return 'inactive';
    if (typeof threshold === 'number' && realValue >= threshold)
      return 'warning';
    if (typeof threshold === 'number' && realValue < threshold) return 'normal';
    return 'inactive';
  });

  if (vibrationStatuses.includes('warning')) return 'warning';
  if (
    vibrationStatuses.length &&
    vibrationStatuses.every((s) => s === 'normal')
  )
    return 'normal';
  return 'inactive';
};

export default function MonitoringPage() {
  const [selectedFacility, setSelectedFacility] = useState(DUMMY_LIST[0]);
  const [facilityStatusList, setFacilityStatusList] = useState<
    FacilityStatus[]
  >(() =>
    DUMMY_LIST.map((f) => ({
      id: f.id,
      gasStatus: (f.gasStatus === 'danger' ? 'warning' : f.gasStatus) as
        | 'normal'
        | 'warning'
        | 'inactive',
      fireStatus: (f.fireStatus === 'danger' ? 'warning' : f.fireStatus) as
        | 'normal'
        | 'warning'
        | 'inactive',
      vibrationStatus: (f.vibrationStatus === 'danger'
        ? 'warning'
        : f.vibrationStatus) as 'normal' | 'warning' | 'inactive',
    }))
  );
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [loginId, setLoginId] = useState<string | null>(null);

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      localStorage.removeItem('loginId');
      window.location.reload();
    }
  };

  // Supabase에서 초기 센서 데이터 로드 함수
  const fetchInitialSensorData = async () => {
    try {
      const res = await fetch('/api/supabase-sensor-status');
      const json = await res.json();

      if (res.ok && json.data && json.data.length > 0) {
        json.data.forEach((record: { topic_id: string; data: any }) => {
          const topicId = record.topic_id;
          const mqtt = record.data; // 바로 data 객체 사용 (이미 파싱되어 있음)
          const id =
            topicId === 'BASE/P001' ? 1 : topicId === 'BASE/P003' ? 2 : null;

          if (id && mqtt) {
            try {
              // barrArr, gdetArr, fdetArr 처리 - WebSocket과 동일한 방식
              const gdetArr = (mqtt.gdet || '').split(',').map(Number);
              const fdetArr = (mqtt.fdet || '').split(',').map(Number);
              const barrArr = (mqtt.barr || '').split(',').map(Number);

              const gasStatus =
                gdetArr.length && gdetArr.some((v: number) => v === 1)
                  ? 'warning'
                  : gdetArr.length && gdetArr.every((v: number) => v === 0)
                  ? 'normal'
                  : 'inactive';

              const fireStatus =
                fdetArr.length && fdetArr.some((v: number) => v === 1)
                  ? 'warning'
                  : fdetArr.length && fdetArr.every((v: number) => v === 0)
                  ? 'normal'
                  : 'inactive';

              // 진동 센서 처리 - WebSocket과 동일한 로직
              const vibrationKeys =
                topicId === 'BASE/P001'
                  ? [
                      'vibration-1',
                      'vibration-2',
                      'vibration-3',
                      'vibration-4',
                      'vibration-5',
                      'vibration-6',
                      'vibration-7',
                      'vibration-8',
                      'vibration-9',
                    ]
                  : topicId === 'BASE/P003'
                  ? ['vibration2-1', 'vibration2-2', 'vibration2-3']
                  : [];

              const vibrationStatuses = vibrationKeys.map((key, idx) => {
                const plcValue = barrArr[idx];
                const realValue = convertPLCtoRealValue(plcValue, key);
                const threshold = VIBRATION_THRESHOLDS[key]?.value;
                if (typeof realValue !== 'number' || isNaN(realValue))
                  return 'inactive';
                if (typeof threshold === 'number' && realValue >= threshold)
                  return 'warning';
                if (typeof threshold === 'number' && realValue < threshold)
                  return 'normal';
                return 'inactive';
              });

              // 전체 진동 상태
              let vibrationStatus: 'inactive' | 'normal' | 'warning' =
                'inactive';
              if (vibrationStatuses.includes('warning')) {
                vibrationStatus = 'warning';
              } else if (
                vibrationStatuses.length &&
                vibrationStatuses.every((s) => s === 'normal')
              ) {
                vibrationStatus = 'normal';
              }

              // 상태 업데이트
              setFacilityStatusList((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        gasStatus,
                        fireStatus,
                        vibrationStatus,
                      }
                    : item
                )
              );
            } catch (e) {
              // console.error('데이터 파싱 오류:', e);
            }
          } else {
            // console.log('처리할 수 없는 레코드:', { id, hasData: !!mqtt });
          }
        });
      } else {
        // console.error('API 응답에 유효한 데이터가 없음:', res.status, json);
      }
    } catch (error) {
      // console.error('초기 센서 상태 로딩 오류:', error);
    }
  };

  useEffect(() => {
    // 초기 센서 상태 로드
    fetchInitialSensorData();

    // 초기 시간 설정
    setCurrentTime(formatTime(new Date()));

    // 1초마다 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoginId(localStorage.getItem('loginId'));
    }
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsAutoCompleteVisible(true);
    if (e.target.value === '') {
      setSelectedFacility(DUMMY_LIST[0]);
      setIsAutoCompleteVisible(false);
    }
  };

  const handleAutoCompleteSelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSearchTerm(facility.name);
    setSelectedFacility(facility);
    setIsAutoCompleteVisible(false);
  };

  const handleSearchBarBlur = () => {
    // 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setIsAutoCompleteVisible(false);
    }, 200);
  };

  // WebSocket으로 실시간 상태 갱신
  useWebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev',
    (data) => {
      const topicId = data?.mqtt_data?.topic_id;
      const mqtt = data?.mqtt_data?.data;
      if ((topicId === 'BASE/P001' || topicId === 'BASE/P003') && mqtt) {
        const gdetArr = (mqtt.gdet || '').split(',').map(Number);
        const fdetArr = (mqtt.fdet || '').split(',').map(Number);
        const barrArr = (mqtt.barr || '').split(',').map(Number);

        const gasStatus =
          gdetArr.length && gdetArr.some((v: number) => v === 1)
            ? 'warning'
            : gdetArr.length && gdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'inactive';

        const fireStatus =
          fdetArr.length && fdetArr.some((v: number) => v === 1)
            ? 'warning'
            : fdetArr.length && fdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'inactive';

        // id에 따라 센서별 임계값 키 결정
        const vibrationKeys =
          topicId === 'BASE/P001'
            ? [
                'vibration-1',
                'vibration-2',
                'vibration-3',
                'vibration-4',
                'vibration-5',
                'vibration-6',
                'vibration-7',
                'vibration-8',
                'vibration-9',
              ]
            : topicId === 'BASE/P003'
            ? ['vibration2-1', 'vibration2-2', 'vibration2-3']
            : [];

        const vibrationStatuses = vibrationKeys.map((key, idx) => {
          const plcValue = barrArr[idx];
          const realValue = convertPLCtoRealValue(plcValue, key);
          const threshold = VIBRATION_THRESHOLDS[key]?.value;
          if (typeof realValue !== 'number' || isNaN(realValue))
            return 'inactive';
          if (typeof threshold === 'number' && realValue >= threshold)
            return 'warning';
          if (typeof threshold === 'number' && realValue < threshold)
            return 'normal';
          return 'inactive';
        });

        // 전체 진동 상태: 하나라도 warning이면 warning, 모두 normal이면 normal, 그 외 inactive
        let vibrationStatus: 'inactive' | 'normal' | 'warning' = 'inactive';
        if (vibrationStatuses.includes('warning')) {
          vibrationStatus = 'warning';
        } else if (
          vibrationStatuses.length &&
          vibrationStatuses.every((s) => s === 'normal')
        ) {
          vibrationStatus = 'normal';
        }

        // topic_id에 따라 id 매핑
        const id = topicId === 'BASE/P001' ? 1 : 2;

        setFacilityStatusList((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  gasStatus,
                  fireStatus,
                  vibrationStatus,
                }
              : item
          )
        );
      }
    }
  );

  // 실시간 상태를 facilityStatusList에서 병합
  const mergedList = DUMMY_LIST.map((facility) => {
    // 상세페이지 없는 충전소(id 3,4,5)는 항상 비활성
    if ([3, 4, 5].includes(facility.id)) {
      return {
        ...facility,
        gasStatus: 'inactive',
        fireStatus: 'inactive',
        vibrationStatus: 'inactive',
      };
    }
    // id:2(삼척 수소충전소)는 실시간 데이터가 있으면 그 값 사용
    const status = facilityStatusList.find((f) => f.id === facility.id);
    return status
      ? {
          ...facility,
          gasStatus: status.gasStatus as typeof facility.gasStatus,
          fireStatus: status.fireStatus as typeof facility.fireStatus,
          vibrationStatus:
            status.vibrationStatus as typeof facility.vibrationStatus,
          status: facility.status as typeof facility.status,
        }
      : facility;
  });

  const filteredList = mergedList.filter((facility) => {
    const searchValue = searchTerm.toLowerCase().replace(/\s+/g, '');
    const facilityName = facility.name.toLowerCase().replace(/\s+/g, '');
    const facilityAddress = facility.address.toLowerCase().replace(/\s+/g, '');

    return (
      facilityName.includes(searchValue) ||
      facilityAddress.includes(searchValue)
    );
  });

  useEffect(() => {
    if (filteredList.length > 0 && !filteredList.includes(selectedFacility)) {
      setSelectedFacility(filteredList[0]);
    }
  }, [searchTerm]);

  const handleFacilitySelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSelectedFacility(facility);
  };

  return (
    <Container>
      <TopBanner>
        <BannerBackground>
          <Image
            src="/images/monitoring/monitoring-bg.jpg"
            alt="수소 생산 시설 전경"
            fill
            sizes="100vw"
            quality={100}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
            priority
          />
          <DarkOverlay />
        </BannerBackground>
        <GNB>
          <Logo>
            <LogoImageWrapper>
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="36px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImageWrapper>
            <span>HyGE</span>
          </Logo>
          <MenuContainer>
            <MainMenu>
              <Link href="/">홈</Link>
              <Link href="/monitoring">
                <BiShieldAlt2 />
                모니터링
              </Link>
              <Link href="/charging">
                <BiGasPump />
                충전소
              </Link>
            </MainMenu>
            <UserMenu>
              {loginId ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{ fontWeight: 500 }}
                >
                  <BiLogIn />
                  로그인: {loginId.toUpperCase()}
                </button>
              ) : (
                <button>
                  <BiLogIn />
                  로그인
                </button>
              )}
            </UserMenu>
          </MenuContainer>
        </GNB>
        <BannerContent>
          <Title>수소 생산시설 & 충전소 모니터링</Title>
          <Subtitle>실시간 모니터링을 통해 안전을 확보합니다.</Subtitle>
        </BannerContent>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <MapContent>
            <FacilityInfo>
              <FacilityInfoCard
                {...(selectedFacility as {
                  id: number;
                  name: string;
                  address: string;
                  gasStatus: 'normal' | 'warning' | 'inactive';
                  fireStatus: 'normal' | 'warning' | 'inactive';
                  vibrationStatus: 'normal' | 'warning' | 'inactive';
                  type: string;
                  status: 'open' | 'closed' | 'preparing';
                  phone: string;
                  imageUrl: string;
                })}
              />
            </FacilityInfo>
            <MapView>
              <SearchBarWrapper>
                <SearchBar>
                  <input
                    type="text"
                    placeholder="수소충전소 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleSearchBarBlur}
                  />
                  {searchTerm && (
                    <ClearButton
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedFacility(DUMMY_LIST[0]);
                        setIsAutoCompleteVisible(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="#D7D7D7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </ClearButton>
                  )}
                  {isAutoCompleteVisible && filteredList.length > 0 && (
                    <AutoCompleteList>
                      {filteredList.map((facility) => (
                        <AutoCompleteItem
                          key={facility.id}
                          onClick={() => handleAutoCompleteSelect(facility)}
                        >
                          <ItemName>{facility.name}</ItemName>
                          <ItemAddress>{facility.address}</ItemAddress>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  )}
                </SearchBar>
              </SearchBarWrapper>
              <Image
                src={
                  selectedFacility.name === '삼척 수소충전소'
                    ? '/images/monitoring/sc.png'
                    : selectedFacility.name === '원주 수소충전소'
                    ? '/images/monitoring/wj.png'
                    : selectedFacility.name === '속초 수소충전소'
                    ? '/images/monitoring/scc.png'
                    : selectedFacility.name === '동해 휴게소 수소충전소'
                    ? '/images/monitoring/dh.png'
                    : '/images/monitoring/kd.png'
                }
                alt={`${selectedFacility.name} 지도`}
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                priority
              />
            </MapView>
          </MapContent>
        </MapSection>

        <ListSection>
          <UpdateTime>업데이트: {currentTime}</UpdateTime>
          <ListHeader>
            <HeaderItem>상호</HeaderItem>
            <HeaderItem hideOnMobile>주소</HeaderItem>
            <HeaderItem>가스감지기</HeaderItem>
            <HeaderItem>화재감지기</HeaderItem>
            <HeaderItem>진동감지기</HeaderItem>
            <HeaderItem>상세보기</HeaderItem>
          </ListHeader>
          <ListContent>
            {filteredList.map((facility) => (
              <FacilityListItem
                key={facility.id}
                {...(facility as {
                  id: number;
                  name: string;
                  address: string;
                  gasStatus: 'normal' | 'warning' | 'inactive';
                  fireStatus: 'normal' | 'warning' | 'inactive';
                  vibrationStatus: 'normal' | 'warning' | 'inactive';
                  type: string;
                  status: 'open' | 'closed' | 'preparing';
                  phone: string;
                  imageUrl: string;
                })}
                isSelected={selectedFacility.id === facility.id}
                onClick={() => handleFacilitySelect(facility)}
                {...([3, 4, 5].includes(facility.id)
                  ? {}
                  : {
                      onDetailClick: () =>
                        (window.location.href =
                          facility.id === 2
                            ? '/monitoring/detail/2/page2'
                            : `/monitoring/detail/${facility.id}`),
                    })}
              />
            ))}
          </ListContent>
        </ListSection>
      </ContentSection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

const TopBanner = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1920/357;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
`;

const BannerContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  color: white;
  z-index: 5;
  text-align: center;
  margin-top: -15px;

  @media (max-width: 768px) {
    margin-top: 80px;
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 32px;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;

const SearchBar = styled.div`
  width: 800px;
  position: relative;
  @media (max-width: 1024px) {
    width: 100%;
    max-width: 600px;
  }
  input {
    width: 100%;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 25px;
    padding: 0 50px 0 20px;
    color: #d7d7d7;
    font-size: 16px;
    text-align: center;
    @media (max-width: 768px) {
      height: 40px;
      font-size: 14px;
    }
    &::placeholder {
      color: #d7d7d7;
      text-align: center;
    }
    &:focus {
      outline: none;
      border-color: #0066ff;
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const MapSection = styled.div`
  margin-bottom: 40px;
  position: relative;
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const MapContent = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const FacilityInfo = styled.div`
  width: 378px;
  height: 500px;
  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: 300px;
  }
`;

const MapView = styled.div`
  flex: 1;
  min-height: 500px;
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  @media (max-width: 1024px) {
    min-height: 400px;
  }
  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const ListSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 17px 30px 30px 30px;
  margin-top: 40px;
  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 30px;
    overflow-x: auto;
  }
`;

const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: right;
  padding: 0 0 12px 0;
`;

const ListHeader = styled.div`
  display: flex;
  background: #f7f7f7;
  padding: 12px 0;
  border-bottom: 1px solid #c5c5c5;
  border-radius: 8px;
  min-width: 800px;
  @media (max-width: 768px) {
    padding: 10px 0;
    min-width: auto;
  }
`;

const HeaderItem = styled.div<{ hideOnMobile?: boolean }>`
  flex: 1;
  text-align: center;
  color: #747474;
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
    display: ${(props) => (props.hideOnMobile ? 'none' : 'block')};
  }
`;

const ListContent = styled.div`
  margin-top: 10px;
  min-width: 800px;
  max-height: 210px;
  overflow-y: auto;
  @media (max-width: 768px) {
    min-width: auto;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }
`;

const GNB = styled.nav`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: clamp(20px, 2.08vw, 40px) 20px;
  user-select: none;
  position: relative;
  z-index: 10;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  user-select: none;
  height: 36px;
  span {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    line-height: 36px;
  }
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const LogoImageWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

const MenuContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const MainMenu = styled.div`
  display: flex;
  gap: 10px;
  user-select: none;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
  a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    svg {
      width: 18px;
      height: 18px;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  gap: 10px;
  user-select: none;
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
  button,
  a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 24px;
    svg {
      width: 18px;
      height: 18px;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
  &:focus {
    outline: none;
  }
`;

const AutoCompleteList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  @media (max-width: 768px) {
    max-height: 250px;
    margin-top: 6px;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const AutoCompleteItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ItemAddress = styled.div`
  color: #d7d7d7;
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

'use client';

import React, { useState, useEffect } from 'react';
import TopBanner from './TopBanner';
import TubeTrailerList from './TubeTrailerList';
import TubeTrailerMap from './TubeTrailerMap';
import styled from 'styled-components';
import { colors } from '@/app/styles/colors';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  PopupOverlay,
  DetailedGraphPopup,
  PopupHeader,
  CloseButton,
  PopupButton,
} from '../styles';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 0;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  flex: 1;
  gap: 15px;
  padding: 15px;
  min-height: 0;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 10px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    gap: 12px;
    height: auto;
  }
`;

const TubeTrailerInfoContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 0;
  border: 1px solid ${colors.theme.light.border};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
  min-height: 0;
  @media (max-width: 768px) {
    min-height: 350px;
    height: 350px;
    margin-bottom: 8px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    min-height: 600px;
  }
`;

const TubeTrailerBottomContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${colors.theme.light.border};
  height: 350px;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
  flex-shrink: 0;
  position: relative;
  @media (max-width: 768px) {
    height: auto;
    min-height: 300px;
    aspect-ratio: 16/9;
    max-height: 70vh;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    height: 320px;
  }
`;

const ListCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px 0 0 0;
  margin: 0px 0 0px 0px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  border: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
  @media (max-width: 768px) {
    padding: 10px 0 0 0;
    border-radius: 10px;
  }
`;

// 기존 감지기 아이콘과 동일한 형식으로 튜브트레일러 아이콘 정의
const TUBE_TRAILER_SENSORS = [
  {
    id: 'break',
    x: (812 / 828) * 100,
    y: (445 / 672) * 100,
    name: '브레이크',
    width: 60,
    height: 60,
    mobileX: 85, // 모바일용 좌표 (%)
    mobileY: 60, // 모바일용 좌표 (%)
    mobileWidth: 40, // 모바일용 크기
    mobileHeight: 40, // 모바일용 크기
  },
  {
    id: 'gear',
    x: (247 / 828) * 100,
    y: (500 / 672) * 100,
    name: '기어',
    width: 28,
    height: 28,
    mobileX: 30,
    mobileY: 70,
    mobileWidth: 20,
    mobileHeight: 20,
  },
  {
    id: 'gear2',
    x: (378 / 828) * 100,
    y: (590 / 672) * 100,
    name: '기어2',
    width: 28,
    height: 28,
    mobileX: 45,
    mobileY: 85,
    mobileWidth: 20,
    mobileHeight: 20,
  },
  {
    id: 'h2',
    x: (812 / 828) * 100,
    y: (282 / 672) * 100,
    name: '수소',
    width: 60,
    height: 60,
    mobileX: 85,
    mobileY: 35,
    mobileWidth: 40,
    mobileHeight: 40,
  },
  {
    id: 'line1',
    x: (387 / 828) * 100,
    y: (500 / 672) * 100,
    name: '라인1',
    width: 285,
    height: 40,
    mobileX: 48,
    mobileY: 83,
    mobileWidth: 220,
    mobileHeight: 5,
  },
  {
    id: 'line2',
    x: (444 / 828) * 100,
    y: (535 / 672) * 100,
    name: '라인2',
    width: 150,
    height: 40,
    mobileX: 55,
    mobileY: 90,
    mobileWidth: 110,
    mobileHeight: 25,
  },
  {
    id: 'line3',
    x: (682 / 828) * 100,
    y: (473 / 672) * 100,
    name: '라인3',
    width: 265,
    height: 50,
    mobileX: 70,
    mobileY: 75,
    mobileWidth: 160,
    mobileHeight: 35,
  },
  {
    id: 'line4',
    x: (689 / 828) * 100,
    y: (397 / 672) * 100,
    name: '라인4',
    width: 480,
    height: 109,
    mobileX: 72,
    mobileY: 65,
    mobileWidth: 300,
    mobileHeight: 75,
  },
];

// id별 이미지 경로 매핑
const TUBE_TRAILER_ICON_SRC = {
  break: '/images/tube-trailer/break.svg',
  gear: '/images/tube-trailer/gear.svg',
  gear2: '/images/tube-trailer/gear.svg',
  h2: '/images/tube-trailer/h2.svg',
  line1: '/images/tube-trailer/Line 1.svg',
  line2: '/images/tube-trailer/Line 2.svg',
  line3: '/images/tube-trailer/Line 3.svg',
  line4: '/images/tube-trailer/Line 4.svg',
};

// 아이콘 크기 상수
const ICON_SIZE = 60;

const TubeTrailerPage = () => {
  const params = useParams() as { id: string };
  const pathname = usePathname();
  const router = useRouter();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // 반응형 디자인을 위한 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    setLastUpdateTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <PageContainer>
      <TopBanner
        params={params}
        pathname={pathname ?? ''}
        isMobile={isMobile}
        lastUpdateTime={lastUpdateTime}
        setIsLogOpen={setIsLogOpen}
        router={router}
      />
      <LayoutContainer>
        <ColumnContainer>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TubeTrailerList
              selectedVehicleId={selectedVehicleId}
              onVehicleSelect={setSelectedVehicleId}
            />
          </div>
          <TubeTrailerBottomContainer>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <img
                src="/images/tube-trailer/tt 2.svg"
                alt="튜브 트레일러"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  maxHeight: isMobile ? '300px' : 'unset',
                }}
              />
              {/* 아이콘 오버레이 */}
              {TUBE_TRAILER_SENSORS.map((sensor) => {
                // 모바일인지 여부에 따라 적절한 위치와 크기 값 사용
                const sensorX = isMobile ? sensor.mobileX : sensor.x;
                const sensorY = isMobile ? sensor.mobileY : sensor.y;
                const sensorWidth = isMobile
                  ? sensor.mobileWidth
                  : sensor.width;
                const sensorHeight = isMobile
                  ? sensor.mobileHeight
                  : sensor.height;

                if (sensor.id === 'line1') {
                  // Line 1: 수평 직선 (파랑)
                  return (
                    <div
                      key={sensor.id}
                      style={{
                        position: 'absolute',
                        left: `${sensorX}%`,
                        top: `${sensorY}%`,
                        width: sensorWidth,
                        height: sensorHeight,
                        pointerEvents: 'none',
                        zIndex: 3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <svg
                        width={isMobile ? 200 : 404}
                        height={2}
                        viewBox="0 0 404 2"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1="0"
                          y1="1"
                          x2="404"
                          y2="1"
                          stroke="#00f6ff"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="30 30"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00f6ff)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <style>{`
                          @keyframes line-flow {
                            0% { stroke-dashoffset: 0; }
                            100% { stroke-dashoffset: -60; }
                          }
                        `}</style>
                      </svg>
                    </div>
                  );
                }
                if (sensor.id === 'line2') {
                  // Line 2: 주황
                  return (
                    <div
                      key={sensor.id}
                      style={{
                        position: 'absolute',
                        left: `${sensorX}%`,
                        top: `${sensorY}%`,
                        width: sensorWidth,
                        height: sensorHeight,
                        pointerEvents: 'none',
                        zIndex: 3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <svg
                        width={isMobile ? 150 : 216}
                        height={isMobile ? 25 : 37}
                        viewBox="0 0 216 37"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1="1"
                          y1="37"
                          x2="1"
                          y2="2"
                          stroke="#ffb300"
                          strokeWidth={isMobile ? 6 : 10}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #ffb300)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <path
                          d="M0 1H216"
                          stroke="#ffb300"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="30 30"
                          style={{
                            filter: 'drop-shadow(0 0 8px #ffb300)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <style>{`
                          @keyframes line-flow {
                            0% { stroke-dashoffset: 0; }
                            100% { stroke-dashoffset: -60; }
                          }
                        `}</style>
                      </svg>
                    </div>
                  );
                }
                if (sensor.id === 'line3') {
                  // Line 3: 핑크
                  return (
                    <div
                      key={sensor.id}
                      style={{
                        position: 'absolute',
                        left: `${sensorX}%`,
                        top: `${sensorY}%`,
                        width: sensorWidth,
                        height: sensorHeight,
                        pointerEvents: 'none',
                        zIndex: 3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <svg
                        width={isMobile ? 180 : 365}
                        height={isMobile ? 40 : 57}
                        viewBox="0 0 365 57"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1="365"
                          y1="1"
                          x2="285"
                          y2="1"
                          stroke="#ff2d55"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #ff2d55)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <line
                          x1="286"
                          y1="1"
                          x2="286"
                          y2="55"
                          stroke="#ff2d55"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #ff2d55)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <path
                          d="M287 56L0 56"
                          stroke="#ff2d55"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="30 30"
                          style={{
                            filter: 'drop-shadow(0 0 8px #ff2d55)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <style>{`
                          @keyframes line-flow {
                            0% { stroke-dashoffset: 0; }
                            100% { stroke-dashoffset: -60; }
                          }
                        `}</style>
                      </svg>
                    </div>
                  );
                }
                if (sensor.id === 'line4') {
                  // Line 4: 연두
                  return (
                    <div
                      key={sensor.id}
                      style={{
                        position: 'absolute',
                        left: `${sensorX}%`,
                        top: `${sensorY}%`,
                        width: sensorWidth,
                        height: sensorHeight,
                        pointerEvents: 'none',
                        zIndex: 3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <svg
                        width={isMobile ? 320 : 381}
                        height={isMobile ? 80 : 152}
                        viewBox="0 0 381 152"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1="380"
                          x2="380"
                          y1="0"
                          y2="83"
                          stroke="#00e676"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00e676)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <line
                          x1="381"
                          y1="84"
                          x2="261"
                          y2="84"
                          stroke="#00e676"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00e676)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <line
                          x1="262"
                          y1="83"
                          x2="262"
                          y2="150"
                          stroke="#00e676"
                          strokeWidth={isMobile ? 3 : 5}
                          strokeDasharray="20 20"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00e676)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <line
                          x1="263"
                          y1="151"
                          x2="0"
                          y2="151"
                          stroke="#00e676"
                          strokeWidth={isMobile ? 8 : 8}
                          strokeDasharray="30 30"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00e676)',
                            animation: 'line-flow 1.2s linear infinite',
                          }}
                        />
                        <style>{`
                          @keyframes line-flow {
                            0% { stroke-dashoffset: 0; }
                            100% { stroke-dashoffset: -60; }
                          }
                        `}</style>
                      </svg>
                    </div>
                  );
                }
                // 나머지 센서는 기존 <img> 방식
                return (
                  <div key={sensor.id}>
                    <img
                      src={
                        TUBE_TRAILER_ICON_SRC[
                          sensor.id as keyof typeof TUBE_TRAILER_ICON_SRC
                        ]
                      }
                      alt={sensor.name}
                      title={sensor.name}
                      style={{
                        position: 'absolute',
                        left: `${sensorX}%`,
                        top: `${sensorY}%`,
                        width: sensorWidth,
                        height: sensorHeight,
                        pointerEvents: 'auto',
                        zIndex: 2,
                        transform: 'translate(-50%, -50%)',
                        filter:
                          'drop-shadow(0 0 12px #00f6ff) drop-shadow(0 0 24px #00f6ff)',
                        animation: 'icon-glow 1.2s ease-in-out infinite',
                      }}
                    />
                    <style>{`
                      @keyframes icon-glow {
                        0% { filter: drop-shadow(0 0 8px #00f6ff) drop-shadow(0 0 16px #00f6ff); }
                        50% { filter: drop-shadow(0 0 24px #00f6ff) drop-shadow(0 0 48px #00f6ff); }
                        100% { filter: drop-shadow(0 0 8px #00f6ff) drop-shadow(0 0 16px #00f6ff); }
                      }
                    `}</style>
                  </div>
                );
              })}
              {/* 이미지 컨테이너 중앙에 와이파이 데이터 전송 효과 */}
              <div
                style={{
                  position: 'absolute',
                  left: isMobile ? '58%' : `${(544 / 828) * 100}%`,
                  top: isMobile ? '62%' : `${(486 / 672) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? 80 : 120,
                  height: isMobile ? 80 : 120,
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  {/* 퍼지는 원형 파동 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="24"
                    fill="none"
                    stroke="#ff6f00"
                    strokeWidth="2"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="r"
                      from="24"
                      to="56"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.7"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="none"
                    stroke="#ff6f00"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="36"
                      to="70"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* WiFi 아이콘 */}
                  <g>
                    <path
                      d="M45 70 Q60 55 75 70"
                      stroke="#ff6f00"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M50 75 Q60 65 70 75"
                      stroke="#ff6f00"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="60" cy="80" r="3.5" fill="#ff6f00" />
                  </g>
                </svg>
              </div>
              {/* 새로운 위치의 와이파이 데이터 전송 효과 */}
              <div
                style={{
                  position: 'absolute',
                  left: isMobile ? '25%' : `${(112 / 828) * 100}%`,
                  top: isMobile ? '35%' : `${(170 / 672) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? 80 : 120,
                  height: isMobile ? 80 : 120,
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  {/* 퍼지는 원형 파동 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="24"
                    fill="none"
                    stroke="#ff6f00"
                    strokeWidth="2"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="r"
                      from="24"
                      to="56"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.7"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="none"
                    stroke="#ff6f00"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="36"
                      to="70"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* WiFi 아이콘 */}
                  <g>
                    <path
                      d="M45 70 Q60 55 75 70"
                      stroke="#ff6f00"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M50 75 Q60 65 70 75"
                      stroke="#ff6f00"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="60" cy="80" r="3.5" fill="#ff6f00" />
                  </g>
                </svg>
              </div>
            </div>
          </TubeTrailerBottomContainer>
        </ColumnContainer>
        <TubeTrailerInfoContainer>
          <TubeTrailerMap
            selectedVehicleId={selectedVehicleId ?? undefined}
            onMarkerClick={(trailer) => setSelectedVehicleId(trailer.id)}
          />
        </TubeTrailerInfoContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default TubeTrailerPage;

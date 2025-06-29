'use client';

import React, { useState, useEffect } from 'react';
import TopBanner from './TopBanner';
import TubeTrailerList from './TubeTrailerList';
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
import TubeTrailerMap from './TubeTrailerMap';
import { tubeTrailerMockData } from './tubeTrailerMockData';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 0;
    overflow-x: hidden;
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
    overflow-x: hidden;
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
  height: auto;
  aspect-ratio: 947 / 350;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 숨김 처리 */
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    min-height: 180px;
    aspect-ratio: 947 / 350;
    max-height: 65vh;
    border-radius: 14px;
    margin-top: 10px;
    width: 100%;
    transform-origin: center center;
  }

  /* CSS 변수로 컨테이너 크기에 따른 자동 스케일 계산 */
  --container-width: 947;
  --container-height: 350;
  --scale-factor: 100%;
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
    x: 97,
    y: 66,
    name: '트레일러의 주차브레이크 ON/OFF 상태',
    width: 60,
    height: 60,
    mobileX: 97,
    mobileY: 66,
    mobileWidth: 36,
    mobileHeight: 36,
    tabletX: 97,
    tabletY: 66,
    tabletWidth: 48,
    tabletHeight: 48,
  },
  {
    id: 'gear',
    x: 30,
    y: 75,
    name: '트렉터와 트레일러의 연결 상태',
    width: 28,
    height: 28,
    mobileX: 30,
    mobileY: 75,
    mobileWidth: 20,
    mobileHeight: 20,
    tabletX: 30,
    tabletY: 75,
    tabletWidth: 24,
    tabletHeight: 24,
  },
  {
    id: 'gear2',
    x: 45.5,
    y: 87,
    name: '랜딩기어를 최상단까지 올리고 운행하는지 여부',
    width: 28,
    height: 28,
    mobileX: 40,
    mobileY: 85,
    mobileWidth: 20,
    mobileHeight: 20,
    tabletX: 40,
    tabletY: 85,
    tabletWidth: 24,
    tabletHeight: 24,
  },
  {
    id: 'h2',
    x: 97,
    y: 42,
    name: '수소 누출 확인',
    width: 60,
    height: 60,
    mobileX: 97,
    mobileY: 42,
    mobileWidth: 36,
    mobileHeight: 36,
    tabletX: 97,
    tabletY: 42,
    tabletWidth: 48,
    tabletHeight: 48,
  },
];

// 점 위치 정의
const TUBE_TRAILER_POINTS = [
  {
    id: 'point1',
    x: 62,
    y: 75,
    radius: 3,
    color: '#00f6ff',
    mobileX: 62,
    mobileY: 75,
    mobileRadius: 5,
    tabletX: 62,
    tabletY: 75,
    tabletRadius: 6,
  },
  {
    id: 'point2',
    x: 32,
    y: 75,
    radius: 3,
    color: '#00f6ff',
    mobileX: 32,
    mobileY: 75,
    mobileRadius: 5,
    tabletX: 32,
    tabletY: 75,
    tabletRadius: 6,
  },
  {
    id: 'point3',
    x: 45.5,
    y: 82,
    radius: 3,
    color: '#00f6ff',
    mobileX: 45.5,
    mobileY: 82,
    mobileRadius: 5,
    tabletX: 45.5,
    tabletY: 82,
    tabletRadius: 6,
  },
  {
    id: 'point4',
    x: 45.5,
    y: 78,
    radius: 3,
    color: '#00f6ff',
    mobileX: 45.5,
    mobileY: 78,
    mobileRadius: 5,
    tabletX: 45.5,
    tabletY: 78,
    tabletRadius: 6,
  },
  {
    id: 'point5',
    x: 62,
    y: 78,
    radius: 3,
    color: '#00f6ff',
    mobileX: 62,
    mobileY: 78,
    mobileRadius: 4,
    tabletX: 62,
    tabletY: 78,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 6
  {
    id: 'point6',
    x: 95,
    y: 64,
    radius: 3,
    color: '#00f6ff',
    mobileX: 95,
    mobileY: 64,
    mobileRadius: 4,
    tabletX: 95,
    tabletY: 64,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 7
  {
    id: 'point7',
    x: 90,
    y: 64,
    radius: 3,
    color: '#00f6ff',
    mobileX: 90,
    mobileY: 64,
    mobileRadius: 4,
    tabletX: 90,
    tabletY: 64,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 8
  {
    id: 'point8',
    x: 90,
    y: 78,
    radius: 3,
    color: '#00f6ff',
    mobileX: 90,
    mobileY: 78,
    mobileRadius: 4,
    tabletX: 90,
    tabletY: 78,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 9
  {
    id: 'point9',
    x: 68,
    y: 78,
    radius: 3,
    color: '#00f6ff',
    mobileX: 68,
    mobileY: 78,
    mobileRadius: 4,
    tabletX: 68,
    tabletY: 78,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 10
  {
    id: 'point10',
    x: 96.8,
    y: 45,
    radius: 3,
    color: '#00f6ff',
    mobileX: 96.8,
    mobileY: 45,
    mobileRadius: 4,
    tabletX: 96.8,
    tabletY: 45,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 11
  {
    id: 'point11',
    x: 96.8,
    y: 58,
    radius: 3,
    color: '#00f6ff',
    mobileX: 96.8,
    mobileY: 58,
    mobileRadius: 4,
    tabletX: 96.8,
    tabletY: 58,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 12
  {
    id: 'point12',
    x: 88.5,
    y: 58,
    radius: 3,
    color: '#00f6ff',
    mobileX: 88.5,
    mobileY: 58,
    mobileRadius: 4,
    tabletX: 88.5,
    tabletY: 58,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 13
  {
    id: 'point13',
    x: 88.5,
    y: 75,
    radius: 3,
    color: '#00f6ff',
    mobileX: 88.5,
    mobileY: 75,
    mobileRadius: 4,
    tabletX: 88.5,
    tabletY: 75,
    tabletRadius: 5,
  },
  // 새로 추가하는 점 14
  {
    id: 'point14',
    x: 68,
    y: 75,
    radius: 3,
    color: '#00f6ff',
    mobileX: 68,
    mobileY: 75,
    mobileRadius: 4,
    tabletX: 68,
    tabletY: 75,
    tabletRadius: 5,
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
      <style jsx global>{`
        @keyframes line-flow {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -100% 0%;
          }
        }

        @media (max-width: 768px) {
          :root {
            --scale-ratio: 0.7;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          :root {
            --scale-ratio: 0.85;
          }
        }
      `}</style>
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
          {!isMobile && (
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
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src="/images/tube-trailer/tt 2.svg"
                  alt="튜브 트레일러"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                  }}
                />
                {/* 아이콘 오버레이 */}
                {TUBE_TRAILER_SENSORS.map((sensor) => {
                  // 아이콘과 라인을 동일한 방식으로 처리
                  const sensorX = isMobile
                    ? sensor.mobileX
                    : isTablet
                    ? sensor.tabletX
                    : sensor.x;
                  const sensorY = isMobile
                    ? sensor.mobileY
                    : isTablet
                    ? sensor.tabletY
                    : sensor.y;
                  const sensorWidth = isMobile
                    ? sensor.mobileWidth
                    : isTablet
                    ? sensor.tabletWidth
                    : sensor.width;
                  const sensorHeight = isMobile
                    ? sensor.mobileHeight
                    : isTablet
                    ? sensor.tabletHeight
                    : sensor.height;

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
                          transformOrigin: 'center center',
                          filter:
                            'drop-shadow(0 0 12px #00f6ff) drop-shadow(0 0 24px #00f6ff)',
                          animation: 'icon-glow 1.2s ease-in-out infinite',
                          maxWidth: isMobile
                            ? '40px'
                            : isTablet
                            ? '50px'
                            : '60px',
                          objectFit: 'contain',
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

                {/* 전류 흐름 효과 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 4,
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute' }}
                  >
                    <defs>
                      <linearGradient
                        id="current-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00f6ff"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="50%"
                          stopColor="#00f6ff"
                          stopOpacity="1"
                        />
                        <stop
                          offset="100%"
                          stopColor="#00f6ff"
                          stopOpacity="0.3"
                        />
                      </linearGradient>
                      <filter
                        id="glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite
                          in="SourceGraphic"
                          in2="blur"
                          operator="over"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>

                {/* 점 2개 추가 */}
                {TUBE_TRAILER_POINTS.map((point) => {
                  const pointX = isMobile
                    ? point.mobileX
                    : isTablet
                    ? point.tabletX
                    : point.x;
                  const pointY = isMobile
                    ? point.mobileY
                    : isTablet
                    ? point.tabletY
                    : point.y;
                  const pointRadius = isMobile
                    ? point.mobileRadius
                    : isTablet
                    ? point.tabletRadius
                    : point.radius;

                  return (
                    <div
                      key={point.id}
                      style={{
                        position: 'absolute',
                        left: `${pointX}%`,
                        top: `${pointY}%`,
                        width: pointRadius * 2,
                        height: pointRadius * 2,
                        borderRadius: '50%',
                        backgroundColor: point.color,
                        transform: 'translate(-50%, -50%)',
                        transformOrigin: 'center center',
                        zIndex: 5,
                        boxShadow: `0 0 10px ${point.color}, 0 0 20px ${point.color}`,
                        animation: 'point-pulse 1.5s ease-in-out infinite',
                        minWidth: isMobile ? '4px' : '5px',
                        minHeight: isMobile ? '4px' : '5px',
                      }}
                    />
                  );
                })}

                {/* 새 전류 효과 구현 - 직접 div로 */}
                <div
                  className="current-line"
                  style={{
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[1].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[1].tabletX
                        : TUBE_TRAILER_POINTS[1].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[1].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[1].tabletY
                        : TUBE_TRAILER_POINTS[1].y
                    }%`,
                    width: `${Math.abs(
                      isMobile
                        ? TUBE_TRAILER_POINTS[0].mobileX -
                            TUBE_TRAILER_POINTS[1].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[0].tabletX -
                          TUBE_TRAILER_POINTS[1].tabletX
                        : TUBE_TRAILER_POINTS[0].x - TUBE_TRAILER_POINTS[1].x
                    )}%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[0].mobileY -
                              TUBE_TRAILER_POINTS[1].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[0].tabletY -
                            TUBE_TRAILER_POINTS[1].tabletY
                          : TUBE_TRAILER_POINTS[0].y - TUBE_TRAILER_POINTS[1].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[0].mobileX -
                              TUBE_TRAILER_POINTS[1].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[0].tabletX -
                            TUBE_TRAILER_POINTS[1].tabletX
                          : TUBE_TRAILER_POINTS[0].x - TUBE_TRAILER_POINTS[1].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점3-4 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[2].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[2].tabletX
                        : TUBE_TRAILER_POINTS[2].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[2].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[2].tabletY
                        : TUBE_TRAILER_POINTS[2].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[3].mobileX -
                                TUBE_TRAILER_POINTS[2].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[3].tabletX -
                              TUBE_TRAILER_POINTS[2].tabletX
                            : TUBE_TRAILER_POINTS[3].x -
                              TUBE_TRAILER_POINTS[2].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[3].mobileY -
                                  TUBE_TRAILER_POINTS[2].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[3].tabletY -
                                TUBE_TRAILER_POINTS[2].tabletY
                              : TUBE_TRAILER_POINTS[3].y -
                                TUBE_TRAILER_POINTS[2].y,
                            2
                          )
                      ) * 0.4
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[3].mobileY -
                              TUBE_TRAILER_POINTS[2].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[3].tabletY -
                            TUBE_TRAILER_POINTS[2].tabletY
                          : TUBE_TRAILER_POINTS[3].y - TUBE_TRAILER_POINTS[2].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[3].mobileX -
                              TUBE_TRAILER_POINTS[2].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[3].tabletX -
                            TUBE_TRAILER_POINTS[2].tabletX
                          : TUBE_TRAILER_POINTS[3].x - TUBE_TRAILER_POINTS[2].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: isMobile ? '20px 2px' : '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                    minWidth: isMobile ? '5px' : '10px',
                  }}
                />

                {/* 점4-5 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[3].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[3].tabletX
                        : TUBE_TRAILER_POINTS[3].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[3].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[3].tabletY
                        : TUBE_TRAILER_POINTS[3].y
                    }%`,
                    width: `${Math.sqrt(
                      Math.pow(
                        isMobile
                          ? TUBE_TRAILER_POINTS[4].mobileX -
                              TUBE_TRAILER_POINTS[3].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[4].tabletX -
                            TUBE_TRAILER_POINTS[3].tabletX
                          : TUBE_TRAILER_POINTS[4].x - TUBE_TRAILER_POINTS[3].x,
                        2
                      ) +
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[4].mobileY -
                                TUBE_TRAILER_POINTS[3].mobileY
                            : isTablet
                            ? TUBE_TRAILER_POINTS[4].tabletY -
                              TUBE_TRAILER_POINTS[3].tabletY
                            : TUBE_TRAILER_POINTS[4].y -
                              TUBE_TRAILER_POINTS[3].y,
                          2
                        )
                    )}%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[4].mobileY -
                              TUBE_TRAILER_POINTS[3].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[4].tabletY -
                            TUBE_TRAILER_POINTS[3].tabletY
                          : TUBE_TRAILER_POINTS[4].y - TUBE_TRAILER_POINTS[3].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[4].mobileX -
                              TUBE_TRAILER_POINTS[3].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[4].tabletX -
                            TUBE_TRAILER_POINTS[3].tabletX
                          : TUBE_TRAILER_POINTS[4].x - TUBE_TRAILER_POINTS[3].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점6-7 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[5].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[5].tabletX
                        : TUBE_TRAILER_POINTS[5].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[5].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[5].tabletY
                        : TUBE_TRAILER_POINTS[5].y
                    }%`,
                    width: `${Math.abs(
                      isMobile
                        ? TUBE_TRAILER_POINTS[6].mobileX -
                            TUBE_TRAILER_POINTS[5].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[6].tabletX -
                          TUBE_TRAILER_POINTS[5].tabletX
                        : TUBE_TRAILER_POINTS[6].x - TUBE_TRAILER_POINTS[5].x
                    )}%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[6].mobileY -
                              TUBE_TRAILER_POINTS[5].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[6].tabletY -
                            TUBE_TRAILER_POINTS[5].tabletY
                          : TUBE_TRAILER_POINTS[6].y - TUBE_TRAILER_POINTS[5].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[6].mobileX -
                              TUBE_TRAILER_POINTS[5].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[6].tabletX -
                            TUBE_TRAILER_POINTS[5].tabletX
                          : TUBE_TRAILER_POINTS[6].x - TUBE_TRAILER_POINTS[5].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점7-8 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[6].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[6].tabletX
                        : TUBE_TRAILER_POINTS[6].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[6].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[6].tabletY
                        : TUBE_TRAILER_POINTS[6].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[7].mobileX -
                                TUBE_TRAILER_POINTS[6].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[7].tabletX -
                              TUBE_TRAILER_POINTS[6].tabletX
                            : TUBE_TRAILER_POINTS[7].x -
                              TUBE_TRAILER_POINTS[6].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[7].mobileY -
                                  TUBE_TRAILER_POINTS[6].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[7].tabletY -
                                TUBE_TRAILER_POINTS[6].tabletY
                              : TUBE_TRAILER_POINTS[7].y -
                                TUBE_TRAILER_POINTS[6].y,
                            2
                          )
                      ) * 0.4
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[7].mobileY -
                              TUBE_TRAILER_POINTS[6].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[7].tabletY -
                            TUBE_TRAILER_POINTS[6].tabletY
                          : TUBE_TRAILER_POINTS[7].y - TUBE_TRAILER_POINTS[6].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[7].mobileX -
                              TUBE_TRAILER_POINTS[6].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[7].tabletX -
                            TUBE_TRAILER_POINTS[6].tabletX
                          : TUBE_TRAILER_POINTS[7].x - TUBE_TRAILER_POINTS[6].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점8-9 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[7].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[7].tabletX
                        : TUBE_TRAILER_POINTS[7].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[7].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[7].tabletY
                        : TUBE_TRAILER_POINTS[7].y
                    }%`,
                    width: `${Math.sqrt(
                      Math.pow(
                        isMobile
                          ? TUBE_TRAILER_POINTS[8].mobileX -
                              TUBE_TRAILER_POINTS[7].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[8].tabletX -
                            TUBE_TRAILER_POINTS[7].tabletX
                          : TUBE_TRAILER_POINTS[8].x - TUBE_TRAILER_POINTS[7].x,
                        2
                      ) +
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[8].mobileY -
                                TUBE_TRAILER_POINTS[7].mobileY
                            : isTablet
                            ? TUBE_TRAILER_POINTS[8].tabletY -
                              TUBE_TRAILER_POINTS[7].tabletY
                            : TUBE_TRAILER_POINTS[8].y -
                              TUBE_TRAILER_POINTS[7].y,
                          2
                        )
                    )}%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[8].mobileY -
                              TUBE_TRAILER_POINTS[7].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[8].tabletY -
                            TUBE_TRAILER_POINTS[7].tabletY
                          : TUBE_TRAILER_POINTS[8].y - TUBE_TRAILER_POINTS[7].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[8].mobileX -
                              TUBE_TRAILER_POINTS[7].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[8].tabletX -
                            TUBE_TRAILER_POINTS[7].tabletX
                          : TUBE_TRAILER_POINTS[8].x - TUBE_TRAILER_POINTS[7].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점10-11 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[9].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[9].tabletX
                        : TUBE_TRAILER_POINTS[9].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[9].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[9].tabletY
                        : TUBE_TRAILER_POINTS[9].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[10].mobileX -
                                TUBE_TRAILER_POINTS[9].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[10].tabletX -
                              TUBE_TRAILER_POINTS[9].tabletX
                            : TUBE_TRAILER_POINTS[10].x -
                              TUBE_TRAILER_POINTS[9].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[10].mobileY -
                                  TUBE_TRAILER_POINTS[9].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[10].tabletY -
                                TUBE_TRAILER_POINTS[9].tabletY
                              : TUBE_TRAILER_POINTS[10].y -
                                TUBE_TRAILER_POINTS[9].y,
                            2
                          )
                      ) * 0.35
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[10].mobileY -
                              TUBE_TRAILER_POINTS[9].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[10].tabletY -
                            TUBE_TRAILER_POINTS[9].tabletY
                          : TUBE_TRAILER_POINTS[10].y -
                            TUBE_TRAILER_POINTS[9].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[10].mobileX -
                              TUBE_TRAILER_POINTS[9].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[10].tabletX -
                            TUBE_TRAILER_POINTS[9].tabletX
                          : TUBE_TRAILER_POINTS[10].x - TUBE_TRAILER_POINTS[9].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점11-12 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[10].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[10].tabletX
                        : TUBE_TRAILER_POINTS[10].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[10].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[10].tabletY
                        : TUBE_TRAILER_POINTS[10].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[11].mobileX -
                                TUBE_TRAILER_POINTS[10].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[11].tabletX -
                              TUBE_TRAILER_POINTS[10].tabletX
                            : TUBE_TRAILER_POINTS[11].x -
                              TUBE_TRAILER_POINTS[10].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[11].mobileY -
                                  TUBE_TRAILER_POINTS[10].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[11].tabletY -
                                TUBE_TRAILER_POINTS[10].tabletY
                              : TUBE_TRAILER_POINTS[11].y -
                                TUBE_TRAILER_POINTS[10].y,
                            2
                          )
                      ) * 0.95
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[11].mobileY -
                              TUBE_TRAILER_POINTS[10].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[11].tabletY -
                            TUBE_TRAILER_POINTS[10].tabletY
                          : TUBE_TRAILER_POINTS[11].y -
                            TUBE_TRAILER_POINTS[10].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[11].mobileX -
                              TUBE_TRAILER_POINTS[10].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[11].tabletX -
                            TUBE_TRAILER_POINTS[10].tabletX
                          : TUBE_TRAILER_POINTS[11].x -
                            TUBE_TRAILER_POINTS[10].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점12-13 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[11].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[11].tabletX
                        : TUBE_TRAILER_POINTS[11].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[11].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[11].tabletY
                        : TUBE_TRAILER_POINTS[11].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[12].mobileX -
                                TUBE_TRAILER_POINTS[11].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[12].tabletX -
                              TUBE_TRAILER_POINTS[11].tabletX
                            : TUBE_TRAILER_POINTS[12].x -
                              TUBE_TRAILER_POINTS[11].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[12].mobileY -
                                  TUBE_TRAILER_POINTS[11].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[12].tabletY -
                                TUBE_TRAILER_POINTS[11].tabletY
                              : TUBE_TRAILER_POINTS[12].y -
                                TUBE_TRAILER_POINTS[11].y,
                            2
                          )
                      ) * 0.35
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[12].mobileY -
                              TUBE_TRAILER_POINTS[11].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[12].tabletY -
                            TUBE_TRAILER_POINTS[11].tabletY
                          : TUBE_TRAILER_POINTS[12].y -
                            TUBE_TRAILER_POINTS[11].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[12].mobileX -
                              TUBE_TRAILER_POINTS[11].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[12].tabletX -
                            TUBE_TRAILER_POINTS[11].tabletX
                          : TUBE_TRAILER_POINTS[12].x -
                            TUBE_TRAILER_POINTS[11].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                {/* 점13-14 전류선 */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[12].mobileX
                        : isTablet
                        ? TUBE_TRAILER_POINTS[12].tabletX
                        : TUBE_TRAILER_POINTS[12].x
                    }%`,
                    top: `${
                      isMobile
                        ? TUBE_TRAILER_POINTS[12].mobileY
                        : isTablet
                        ? TUBE_TRAILER_POINTS[12].tabletY
                        : TUBE_TRAILER_POINTS[12].y
                    }%`,
                    width: `${
                      Math.sqrt(
                        Math.pow(
                          isMobile
                            ? TUBE_TRAILER_POINTS[13].mobileX -
                                TUBE_TRAILER_POINTS[12].mobileX
                            : isTablet
                            ? TUBE_TRAILER_POINTS[13].tabletX -
                              TUBE_TRAILER_POINTS[12].tabletX
                            : TUBE_TRAILER_POINTS[13].x -
                              TUBE_TRAILER_POINTS[12].x,
                          2
                        ) +
                          Math.pow(
                            isMobile
                              ? TUBE_TRAILER_POINTS[13].mobileY -
                                  TUBE_TRAILER_POINTS[12].mobileY
                              : isTablet
                              ? TUBE_TRAILER_POINTS[13].tabletY -
                                TUBE_TRAILER_POINTS[12].tabletY
                              : TUBE_TRAILER_POINTS[13].y -
                                TUBE_TRAILER_POINTS[12].y,
                            2
                          )
                      ) * 1.0
                    }%`,
                    height: 3,
                    background: `linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%)`,
                    borderRadius: '1.5px',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${
                      (Math.atan2(
                        isMobile
                          ? TUBE_TRAILER_POINTS[13].mobileY -
                              TUBE_TRAILER_POINTS[12].mobileY
                          : isTablet
                          ? TUBE_TRAILER_POINTS[13].tabletY -
                            TUBE_TRAILER_POINTS[12].tabletY
                          : TUBE_TRAILER_POINTS[13].y -
                            TUBE_TRAILER_POINTS[12].y,
                        isMobile
                          ? TUBE_TRAILER_POINTS[13].mobileX -
                              TUBE_TRAILER_POINTS[12].mobileX
                          : isTablet
                          ? TUBE_TRAILER_POINTS[13].tabletX -
                            TUBE_TRAILER_POINTS[12].tabletX
                          : TUBE_TRAILER_POINTS[13].x -
                            TUBE_TRAILER_POINTS[12].x
                      ) *
                        180) /
                      Math.PI
                    }deg)`,
                    zIndex: 4,
                    boxShadow: '0 0 10px #00f6ff, 0 0 20px #00f6ff',
                    backgroundSize: '30px 3px',
                    backgroundImage:
                      'linear-gradient(90deg, #00f6ff 50%, transparent 50%)',
                    backgroundRepeat: 'repeat-x',
                    animation: 'current-flow 1s linear infinite',
                  }}
                />

                <style>{`
                  @keyframes point-pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                  }
                  @keyframes current-flow {
                    0% { background-position: 0 0; }
                    100% { background-position: 30px 0; }
                  }
                  
                  @media (max-width: 768px) {
                    @keyframes current-flow {
                      0% { background-position: 0 0; }
                      100% { background-position: 20px 0; }
                    }
                  }
                  
                  .current-line {
                    position: absolute;
                    height: 3px;
                    background: linear-gradient(90deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 1) 50%, rgba(0, 246, 255, 0.3) 100%);
                    border-radius: 1.5px;
                    transform-origin: left center;
                    z-index: 4;
                    box-shadow: 0 0 10px #00f6ff, 0 0 20px #00f6ff;
                    background-size: 30px 3px;
                    background-image: linear-gradient(90deg, #00f6ff 50%, transparent 50%);
                    background-repeat: repeat-x;
                    animation: current-flow 1s linear infinite;
                  }
                  
                  @media (max-width: 768px) {
                    .current-line {
                      height: 2px;
                      background-size: 20px 2px;
                      min-width: 5px;
                    }
                  }

                  

                `}</style>

                {/* 이미지 컨테이너 중앙에 와이파이 데이터 전송 효과 */}
                <div
                  style={{
                    position: 'absolute',
                    left: isMobile
                      ? '58%'
                      : isTablet
                      ? '56%'
                      : `${(544 / 828) * 100}%`,
                    top: isMobile
                      ? '62%'
                      : isTablet
                      ? '60%'
                      : `${(486 / 672) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 80 : isTablet ? 100 : 120,
                    height: isMobile ? 80 : isTablet ? 100 : 120,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
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
                    left: isMobile
                      ? '25%'
                      : isTablet
                      ? '20%'
                      : `${(112 / 828) * 100}%`,
                    top: isMobile
                      ? '35%'
                      : isTablet
                      ? '30%'
                      : `${(170 / 672) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 80 : isTablet ? 100 : 120,
                    height: isMobile ? 80 : isTablet ? 100 : 120,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
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
          )}
        </ColumnContainer>
        <TubeTrailerInfoContainer>
          <TubeTrailerMap
            center={(() => {
              if (tubeTrailerMockData.length > 0) {
                return {
                  latitude: tubeTrailerMockData[0].lat,
                  longitude: tubeTrailerMockData[0].lng,
                };
              }
              return { latitude: 37.5665, longitude: 126.978 };
            })()}
            markers={tubeTrailerMockData.map((t) => ({
              id: t.id,
              carNo: t.carNo,
              coupling: t.coupling,
              landingGearL: t.landingGearL,
              landingGearR: t.landingGearR,
              tBrake: t.tBrake,
              gasSensor: t.gasSensor,
              lat: t.lat,
              lng: t.lng,
              backgroundColor: t.backgroundColor,
            }))}
            selectedVehicleId={selectedVehicleId}
          />
        </TubeTrailerInfoContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default TubeTrailerPage;

'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: MapOptions) => Map;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        Point: new (x: number, y: number) => Point;
        Size: new (width: number, height: number) => Size;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        MapTypeId: {
          NORMAL: string;
          TERRAIN: string;
          SATELLITE: string;
          HYBRID: string;
        };
        Position: {
          TOP: number;
          TOP_LEFT: number;
          TOP_RIGHT: number;
          LEFT: number;
          CENTER: number;
          RIGHT: number;
          BOTTOM: number;
          BOTTOM_LEFT: number;
          BOTTOM_RIGHT: number;
        };
        Event: {
          addListener: (target: any, type: string, handler: Function) => void;
          removeListener: (
            target: any,
            type: string,
            handler: Function
          ) => void;
        };
        Animation: {
          BOUNCE: number;
          DROP: number;
        };
      };
    };
  }
}

interface Point {
  x: number;
  y: number;
  toString(): string;
  equals(point: Point): boolean;
  clone(): Point;
}

interface LatLng {
  lat(): number;
  lng(): number;
  toString(): string;
  equals(latlng: LatLng): boolean;
  clone(): LatLng;
  toPoint(): Point;
}

interface MapOptions {
  center: LatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  mapTypeId?: string;
  draggable?: boolean;
  scrollWheel?: boolean;
}

interface Marker {
  setMap(map: Map | null): void;
  setPosition(position: LatLng): void;
  setAnimation(animation: number | null): void;
  getPosition(): LatLng;
  getMap(): Map | null;
}

interface MarkerOptions {
  position: LatLng;
  map?: Map;
  icon?: string | MarkerIcon;
  title?: string;
  animation?: number;
  clickable?: boolean;
  zIndex?: number;
}

interface Map {
  setCenter(latlng: LatLng): void;
  setZoom(level: number): void;
  panTo(latlng: LatLng): void;
  getCenter(): LatLng;
  getZoom(): number;
  destroy(): void;
}

interface Size {
  width: number;
  height: number;
  equals(size: Size): boolean;
  toString(): string;
}

interface InfoWindowOptions {
  content: string;
  position?: LatLng;
  maxWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  disableAnchor?: boolean;
  pixelOffset?: Point;
  zIndex?: number;
}

interface InfoWindow {
  open(map: Map, anchor?: Marker): void;
  close(): void;
  setContent(content: string): void;
  setPosition(position: LatLng): void;
  setSize(size: Size): void;
  getMap(): Map | null;
}

interface MarkerIcon {
  content: string;
  size: Size;
  anchor: Point;
}

const Container = styled.section`
  width: 100%;
  height: auto;
  min-height: 968px;
  background-color: #f2f2f2;
  padding: 80px clamp(1rem, 16.67vw, 320px);
  display: flex;
  align-items: center;

  @media (max-width: 1366px) {
    padding: 60px 2rem;
    min-height: 800px;
  }

  @media (max-width: 768px) {
    padding: 40px 1rem;
    min-height: auto;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 1279px;
  height: auto;
  min-height: 780px;
  background: #ffffff;
  border-radius: 36px;
  padding: 32px;
  display: flex;
  gap: 32px;
  margin: 0 auto;

  @media (max-width: 1366px) {
    padding: 24px;
    gap: 24px;
    min-height: 680px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 20px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 24px;
  }
`;

const InfoSection = styled.div`
  width: 534px;
  flex-shrink: 0;

  @media (max-width: 1366px) {
    width: 440px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    flex-shrink: 1;
  }
`;

const SectionTitle = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title-area {
    span {
      font-family: 'Pretendard';
      font-size: 16px;
      color: #767676;
      display: block;
      margin-bottom: 4px;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }

    h2 {
      font-family: 'Pretendard';
      font-weight: 600;
      font-size: 28px;
      color: #000000;
      margin: 0;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateX(-30px);
  margin-top: 20px;

  @media (max-width: 768px) {
    transform: none;
    margin-top: 0;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 20px;
  border: 2px solid rgba(39, 175, 233, 0.2);
  border-radius: 22px;
  font-family: 'Pretendard';
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  background: #ffffff;

  @media (max-width: 768px) {
    height: 40px;
    font-size: 14px;
  }

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #27afe9;
    box-shadow: 0 0 0 4px rgba(39, 175, 233, 0.1);
  }
`;

const StationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding: 4px;
  margin-top: 20px;

  @media (max-width: 1366px) {
    max-height: 500px;
  }

  @media (max-width: 1024px) {
    max-height: 320px;
  }

  @media (max-width: 768px) {
    padding: 2px;
    gap: 8px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(39, 175, 233, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(39, 175, 233, 0.5);
    }
  }
`;

const InfoDetails = styled.div<{ $isActive?: boolean }>`
  display: flex;
  flex: 1;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${(props) =>
      props.$isActive
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(39, 175, 233, 0.05)'};
    padding: 8px 12px;
    border-radius: 8px;

    span {
      font-family: 'Pretendard';
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => (props.$isActive ? '#ffffff' : '#333333')};

      @media (max-width: 768px) {
        font-size: 13px;
      }

      &:first-child {
        opacity: ${(props) => (props.$isActive ? '0.85' : '0.7')};
        font-weight: 400;
      }

      &:last-child {
        font-weight: 600;
      }
    }
  }
`;

const StationItem = styled.div<{ $isActive?: boolean }>`
  width: 100%;
  background: ${(props) =>
    props.$isActive ? 'linear-gradient(135deg, #27AFE9, #1E8DBB)' : '#ffffff'};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${(props) => (props.$isActive ? 'transparent' : '#f0f0f0')};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: ${(props) => (props.$isActive ? '#FFFFFF' : '#000000')};
  box-shadow: ${(props) =>
    props.$isActive
      ? '0 8px 16px rgba(39, 175, 233, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.02)'};

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$isActive
        ? '0 12px 20px rgba(39, 175, 233, 0.2)'
        : '0 8px 16px rgba(0, 0, 0, 0.05)'};
  }

  .station-name {
    font-family: 'Pretendard';
    font-weight: ${(props) => (props.$isActive ? '700' : '600')};
    font-size: 20px;
    margin-bottom: ${(props) => (props.$isActive ? '4px' : '0')};
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${(props) => (props.$isActive ? '#ffffff' : '#27AFE9')};
      opacity: ${(props) => (props.$isActive ? '1' : '0.5')};
    }

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  .station-details {
    height: ${(props) => (props.$isActive ? 'auto' : '0')};
    opacity: ${(props) => (props.$isActive ? '1' : '0')};
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: ${(props) => (props.$isActive ? '16px' : '0')};
    border-top: ${(props) =>
      props.$isActive ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'};
    padding-top: ${(props) => (props.$isActive ? '16px' : '0')};

    @media (max-width: 768px) {
      margin-top: ${(props) => (props.$isActive ? '12px' : '0')};
      padding-top: ${(props) => (props.$isActive ? '12px' : '0')};
    }

    .address-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
      }

      p {
        font-family: 'Pretendard';
        font-size: 15px;
        margin: 0;
        opacity: 0.9;
        flex: 1;
        line-height: 1.5;

        @media (max-width: 768px) {
          font-size: 14px;
          width: 100%;
        }
      }
    }

    ${InfoDetails} {
      margin-top: 12px;
    }
  }
`;

const DirectionButton = styled.button`
  height: 36px;
  padding: 0 20px;
  background: #27afe9;
  border: none;
  border-radius: 18px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::after {
    content: '→';
    font-size: 18px;
    line-height: 1;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 32px;
    font-size: 13px;
    justify-content: center;
  }

  &:hover {
    transform: translateX(2px);
    background: #1e8dbb;
  }
`;

const MapArea = styled.div`
  flex: 1;
  height: 100%;
  background: #f9f9f9;
  border-radius: 24px;
  position: relative;
  overflow: hidden;

  @media (max-width: 1024px) {
    min-height: 400px;
  }

  @media (max-width: 768px) {
    min-height: 300px;
    border-radius: 16px;
  }

  #map {
    width: 100%;
    height: 100%;
    min-height: 716px;
    position: relative;
    z-index: 1;

    @media (max-width: 1366px) {
      min-height: 616px;
    }

    @media (max-width: 1024px) {
      min-height: 400px;
    }

    @media (max-width: 768px) {
      min-height: 300px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
    z-index: 2;
  }
`;

interface Station {
  id: number;
  chrstn_nm: string;
  road_nm_addr: string;
  lotno_addr: string;
  ntsl_pc: string;
  la: string; // 위도
  lo: string; // 경도
  realTimeInfo?: {
    chrg_sttus: string;
    wait_vhcle_alge: number;
    tt_pressr: string;
    updt_dt: string;
  };
}

const MapSection = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  let isInitialized = false;
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 500;
  let initialMarker: any = null;
  let currentInfoWindow: any = null;
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 수동으로 추가한 충전소 좌표 정보
  const manualCoordinates: { [key: string]: { la: string; lo: string } } = {
    '(JNK)수도권매립지 수소충전소': {
      la: '37.5947474',
      lo: '126.6273574',
    },
    '(유)유정에너지 목포수소충전소': {
      la: '34.8053074',
      lo: '126.3821504',
    },
  };

  // 주소 수정이 필요한 충전소 목록
  const addressCorrections: { [key: string]: string } = {
    '삼척 교동 수소충전복합스테이션': '강원 삼척시 뒷나루길 137',
    H국회수소충전소: '서울특별시 영등포구 국회대로 741',
  };

  useEffect(() => {
    // 서버사이드에서 실행되지 않도록 체크
    if (typeof window === 'undefined') return;

    const initializeMap = async () => {
      if (!mapContainerRef.current || !window.naver?.maps) return false;

      try {
        // 초기 좌표 직접 설정
        const initialLocation = {
          lat: 37.42426,
          lng: 126.8876,
        };

        const mapOptions = {
          center: new window.naver.maps.LatLng(
            initialLocation.lat,
            initialLocation.lng
          ),
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: {
            position: (window.naver.maps as any).Position.TOP_RIGHT as number,
          },
          mapTypeId: window.naver.maps.MapTypeId.SATELLITE,
        };

        mapRef.current = new window.naver.maps.Map(
          mapContainerRef.current,
          mapOptions
        );

        // 초기 위치에 마커 추가
        const markerPosition = new window.naver.maps.LatLng(
          initialLocation.lat,
          initialLocation.lng
        );

        // 마커 아이콘 설정
        const markerIcon = {
          content: `
            <div style="
              width: 40px;
              height: 40px;
              background: rgba(255, 255, 255, 0.5);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              border: 2px solid rgba(255, 255, 255, 0.5);
              position: relative;
              overflow: hidden;
            ">
              <img 
                src="/images/ge_logo.png"
                alt="GE Logo"
                width="32"
                height="32"
                style="object-fit: contain;"
                loading="eager"
              />
            </div>`,
          size: new window.naver.maps.Size(48, 48),
          anchor: new window.naver.maps.Point(24, 24),
        } as MarkerIcon;

        // 마커 생성
        initialMarker = new window.naver.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          icon: markerIcon,
          animation: window.naver.maps.Animation.DROP,
          zIndex: 3,
        } as any);

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(initialMarker, 'click', () => {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div style="
                padding: 20px;
                min-width: 240px;
                font-family: 'Pretendard';
                border-radius: 16px;
                background: #FFFFFF;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                ">
                  <div style="
                    font-size: 14px;
                    color: #767676;
                  ">Location</div>
                  <div style="
                    font-size: 20px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 4px;
                  ">주식회사 지이 본사</div>
                  <div style="
                    font-size: 15px;
                    color: #333333;
                    line-height: 1.4;
                  ">경기도 광명시 일직로 43 광명역M클러스터</div>
                </div>
              </div>
            `,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            disableAnchor: true,
            pixelOffset: new window.naver.maps.Point(0, -20),
          });

          if (currentInfoWindow !== null && currentInfoWindow.getMap()) {
            currentInfoWindow.close();
            if (currentInfoWindow === infoWindow) {
              currentInfoWindow = null;
              return;
            }
          }

          infoWindow.open(mapRef.current, initialMarker);
          currentInfoWindow = infoWindow;

          // 지도 클릭 시 정보창 닫기
          window.naver.maps.Event.addListener(mapRef.current, 'click', () => {
            if (currentInfoWindow) {
              currentInfoWindow.close();
              currentInfoWindow = null;
            }
          });
        });

        return true;
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        return false;
      }
    };

    const initializeMapWithRetry = async () => {
      if (isInitialized) return;

      let retryCount = 0;
      const tryInitialize = async () => {
        if (retryCount >= MAX_RETRIES) {
          console.error('최대 시도 횟수 초과');
          return;
        }

        console.log(`지도 초기화 시도 ${retryCount + 1}/${MAX_RETRIES}`);
        if (await initializeMap()) {
          isInitialized = true;
        } else {
          retryCount++;
          setTimeout(tryInitialize, RETRY_DELAY);
        }
      };

      tryInitialize();
    };

    initializeMapWithRetry();

    return () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      if (initialMarker) {
        initialMarker.setMap(null);
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      isInitialized = false;
    };
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log('Fetching stations data...');

        const [operationResponse, currentResponse] = await Promise.all([
          fetch('/api/chrstnList/operationInfo', {
            headers: {
              Authorization:
                'qTOgd8m3zOD7iqJ1C6waFjZHtI1Wm4jylhz0dHU9ADSmK0csI13mnpvN2R1N7jN9',
            },
          }),
          fetch('/api/chrstnList/currentInfo', {
            headers: {
              Authorization:
                'qTOgd8m3zOD7iqJ1C6waFjZHtI1Wm4jylhz0dHU9ADSmK0csI13mnpvN2R1N7jN9',
            },
          }),
        ]);

        console.log('Operation Response Status:', operationResponse.status);
        console.log('Current Response Status:', currentResponse.status);

        if (!operationResponse.ok || !currentResponse.ok) {
          console.error('Operation Response:', operationResponse);
          console.error('Current Response:', currentResponse);
          throw new Error(
            `API 요청 실패 - Operation: ${operationResponse.status}, Current: ${currentResponse.status}`
          );
        }

        const [operationData, currentData] = await Promise.all([
          operationResponse.json(),
          currentResponse.json(),
        ]);

        console.log('Operation Data:', operationData);
        console.log('Current Data:', currentData);

        // API 응답 구조 타입 정의
        interface ApiResponse {
          response?: {
            body?: {
              items?: any[];
            };
          };
          data?: any[];
        }

        // operationData가 배열이 아닌 경우 처리
        const operationArray = Array.isArray(operationData)
          ? operationData
          : (operationData as ApiResponse)?.response?.body?.items ||
            (operationData as ApiResponse)?.data ||
            [];

        console.log('Processed Operation Array:', operationArray);

        // currentData가 배열이 아닌 경우 처리
        const currentArray = Array.isArray(currentData)
          ? currentData
          : (currentData as ApiResponse)?.response?.body?.items ||
            (currentData as ApiResponse)?.data ||
            [];

        console.log('Processed Current Array:', currentArray);

        // 실시간 데이터 매핑
        const realTimeData = currentArray.reduce((acc: any, item: any) => {
          if (item.chrstn_nm) {
            acc[item.chrstn_nm] = {
              chrg_sttus: item.chrg_sttus,
              wait_vhcle_alge: item.wait_vhcle_alge,
              tt_pressr: item.tt_pressr,
              updt_dt: item.updt_dt,
            };
          }
          return acc;
        }, {});

        console.log('Processed Real Time Data:', realTimeData);

        if (!operationArray.length) {
          console.warn('Operation array is empty');
        }

        const allStations = operationArray
          .map((station: any, index: number) => {
            const manualCoords = manualCoordinates[station.chrstn_nm];
            if (!station.la || !station.lo) {
              if (manualCoords) {
                station.la = manualCoords.la;
                station.lo = manualCoords.lo;
              }
            }

            const correctedAddress = addressCorrections[station.chrstn_nm];
            if (correctedAddress) {
              station.road_nm_addr = correctedAddress;
            }

            return {
              id: index + 1,
              ...station,
              realTimeInfo: realTimeData[station.chrstn_nm] || {},
            };
          })
          .sort((a: Station, b: Station) =>
            a.chrstn_nm.localeCompare(b.chrstn_nm)
          );

        console.log('Final Processed Stations:', allStations);

        setStations(allStations);
        if (mapRef.current) {
          updateMarkers(allStations);
        }
      } catch (error: any) {
        console.error('Error fetching stations:', error);
        console.error('Error details:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error);
        },
        options
      );
    }
  }, []);

  const updateMarkers = (stations: Station[]) => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    stations.forEach((station) => {
      if (station.la && station.lo) {
        const position = new window.naver.maps.LatLng(
          parseFloat(station.la),
          parseFloat(station.lo)
        );

        const marker = new window.naver.maps.Marker({
          position: position,
          map: mapRef.current,
          title: station.chrstn_nm,
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', () => {
          handleStationClick(station.id);
        });

        markersRef.current.push(marker);
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 디바운스 처리
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      const filtered = stations.filter((station) => {
        const searchLower = value.toLowerCase().replace(/\s/g, '');
        const stationName = (station.chrstn_nm || '')
          .toLowerCase()
          .replace(/\s/g, '');
        const stationAddress = (
          station.road_nm_addr ||
          station.lotno_addr ||
          ''
        )
          .toLowerCase()
          .replace(/\s/g, '');

        return (
          stationName.includes(searchLower) ||
          stationAddress.includes(searchLower)
        );
      });

      setFilteredStations(filtered);
      if (filtered.length > 0 && value) {
        handleStationClick(filtered[0].id);
      }
    }, 300);
  };

  // 메모이제이션된 필터링 결과
  const filteredStationsResult = useMemo(() => {
    return searchTerm ? filteredStations : stations;
  }, [searchTerm, filteredStations, stations]);

  // useCallback으로 이벤트 핸들러 최적화
  const handleStationClick = useCallback(
    async (stationId: number) => {
      setActiveStation(activeStation === stationId ? null : stationId);

      const selectedStation = stations.find(
        (station) => station.id === stationId
      );
      if (!selectedStation || !mapRef.current) return;

      try {
        // 좌표가 이미 있는 경우 직접 사용
        if (selectedStation.la && selectedStation.lo) {
          const point = new window.naver.maps.LatLng(
            parseFloat(selectedStation.la),
            parseFloat(selectedStation.lo)
          );

          mapRef.current.setCenter(point);
          mapRef.current.setZoom(19);

          const marker = new window.naver.maps.Marker({
            position: point,
            map: mapRef.current,
            title: selectedStation.chrstn_nm,
          });

          markersRef.current.forEach((m) => m.setMap(null));
          markersRef.current = [marker];
          return;
        }

        // 좌표가 없는 경우 주소로 검색
        let address =
          selectedStation.road_nm_addr || selectedStation.lotno_addr;
        if (!address) return;

        // 주소 정제
        address = address
          .replace(/\s+/g, ' ') // 연속된 공백을 하나로
          .trim() // 앞뒤 공백 제거
          .replace(/\([^)]*\)/g, '') // 괄호와 그 안의 내용 제거
          .replace(/\s*,.*$/, '') // 쉼표 이후 모든 내용 제거
          .trim();

        // 시도명이 없는 경우 추가
        if (
          !address.match(
            /^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/
          )
        ) {
          // 주소에서 첫 번째 지역명 추출
          const firstRegion = address.split(' ')[0];
          // 시도명 매핑
          const regionMapping: { [key: string]: string } = {
            중구: '서울',
            종로구: '서울',
            용산구: '서울',
            서구: '인천',
            괴산군: '충북',
            북구: '울산',
            // 필요한 매핑 추가
          };
          if (regionMapping[firstRegion]) {
            address = `${regionMapping[firstRegion]} ${address}`;
          }
        }

        console.log('정제된 주소:', address);

        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(`/api/geocode?query=${encodedAddress}`);

        if (!response.ok) {
          throw new Error(`지오코딩 API 요청 실패: ${response.status}`);
        }

        let data = await response.json();
        console.log('지오코딩 응답:', data);

        if (
          !data.addresses ||
          data.addresses.length === 0 ||
          !data.status ||
          data.status !== 'OK'
        ) {
          // 도로명 주소로 실패한 경우 지번 주소로 재시도
          if (
            selectedStation.lotno_addr &&
            selectedStation.lotno_addr !== address
          ) {
            let jibunAddress = selectedStation.lotno_addr
              .replace(/\s+/g, ' ')
              .trim()
              .replace(/\([^)]*\)/g, '')
              .replace(/\s*,.*$/, '')
              .trim();

            console.log('지번 주소로 재시도:', jibunAddress);

            const encodedJibunAddress = encodeURIComponent(jibunAddress);
            const jibunResponse = await fetch(
              `/api/geocode?query=${encodedJibunAddress}`
            );

            if (!jibunResponse.ok) {
              throw new Error(
                `지번 주소 지오코딩 실패: ${jibunResponse.status}`
              );
            }

            const jibunData = await jibunResponse.json();
            if (jibunData.addresses && jibunData.addresses.length > 0) {
              data = jibunData;
            } else {
              console.log('지번 주소로도 찾을 수 없습니다:', jibunAddress);
              return;
            }
          } else {
            console.log('주소 정보를 찾을 수 없습니다:', address);
            return;
          }
        }

        const item = data.addresses[0];
        const point = new window.naver.maps.LatLng(
          parseFloat(item.y),
          parseFloat(item.x)
        );

        mapRef.current.setCenter(point);
        mapRef.current.setZoom(19);

        const marker = new window.naver.maps.Marker({
          position: point,
          map: mapRef.current,
          title: selectedStation.chrstn_nm,
        });

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [marker];
      } catch (error) {
        console.error('지도 이동 중 오류 발생:', error);
      }
    },
    [activeStation, stations]
  );

  const handleDirectionClick = async (address: string) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`/api/geocode?query=${encodedAddress}`);

      if (!response.ok) {
        throw new Error(`지오코딩 API 요청 실패: ${response.status}`);
      }

      let data = await response.json();
      console.log('지오코딩 응답:', data);

      if (!data.addresses || data.addresses.length === 0) {
        console.error('주소를 찾을 수 없습니다.');
        return;
      }

      const destination = data.addresses[0];
      let naverMapUrl = 'https://map.naver.com/v5/directions';

      if (currentLocation) {
        // 출발지 (현재 위치)
        naverMapUrl += `/${currentLocation.lng},${currentLocation.lat},내위치`;
      } else {
        naverMapUrl += `/-/-/-`;
      }

      // 목적지 (충전소)
      naverMapUrl += `/${destination.x},${destination.y},${encodeURIComponent(
        address
      )}/-/car?c=14,0,0,0,dh`;

      window.open(naverMapUrl, '_blank');
    } catch (error) {
      console.error('길찾기 URL 생성 중 오류 발생:', error);

      // 오류 발생 시 기본 URL로 폴백
      const fallbackUrl = `https://map.naver.com/v5/directions/-/-/-/${encodeURIComponent(
        address
      )}/-/car?c=14,0,0,0,dh`;
      window.open(fallbackUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Container>
        <Card>
          <div>데이터를 불러오는 중입니다...</div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <InfoSection>
          <SectionTitle>
            <div className="title-area">
              <span>Map</span>
              <h2>수소충전소 위치</h2>
            </div>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="충전소 검색"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchContainer>
          </SectionTitle>
          <StationList>
            {filteredStationsResult.map((station) => (
              <StationItem
                key={station.id}
                $isActive={activeStation === station.id}
                onClick={() => handleStationClick(station.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStationClick(station.id);
                  }
                }}
              >
                <div className="station-name">{station.chrstn_nm}</div>
                <div className="station-details">
                  <div className="address-row">
                    <p>{station.road_nm_addr || station.lotno_addr}</p>
                    <DirectionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectionClick(
                          station.road_nm_addr || station.lotno_addr
                        );
                      }}
                    >
                      길찾기
                    </DirectionButton>
                  </div>
                  <InfoDetails $isActive={activeStation === station.id}>
                    <div>
                      <span>판매가격</span>
                      <span>
                        {parseInt(station.ntsl_pc).toLocaleString()}원
                      </span>
                    </div>
                    <div>
                      <span>충전압력</span>
                      <span>
                        {station.realTimeInfo?.tt_pressr
                          ? `${Math.floor(
                              parseInt(station.realTimeInfo.tt_pressr) / 10
                            )} BAR`
                          : '-'}
                      </span>
                    </div>
                  </InfoDetails>
                </div>
              </StationItem>
            ))}
          </StationList>
        </InfoSection>
        <MapArea>
          <div ref={mapContainerRef} id="map" />
        </MapArea>
      </Card>
    </Container>
  );
};

export default MapSection;

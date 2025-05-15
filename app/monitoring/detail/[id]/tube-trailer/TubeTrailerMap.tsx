/// <reference path="../../../../../app/types/global.d.ts" />

import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  GoogleMap,
  useLoadScript,
  InfoWindow,
  Libraries,
  MarkerF,
} from '@react-google-maps/api';
import { tubeTrailerMockData } from './tubeTrailerMockData';
import { Truck, Link2, Anchor, Disc, Gauge, Droplets } from 'lucide-react';

const libraries: Libraries = ['places', 'marker'];

// InfoWindow 닫기 버튼 숨기기 위한 전역 스타일
const GlobalStyle = createGlobalStyle`
  .gm-ui-hover-effect {
    display: none !important;
  }
  
  .gm-style-iw {
    padding: 0 !important;
    border-radius: 8px !important;
  }
  
  .gm-style-iw-d {
    overflow: hidden !important;
    padding: 0 !important;
    border-radius: 8px !important;
  }
  
  .gm-style-iw-c {
    padding: 0 !important;
    border-radius: 8px !important;
  }

  .gm-style-iw-ch {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* InfoWindow 테두리 스타일 수정 */
  .gm-style .gm-style-iw-tc {
    display: none !important;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: visible;
  position: relative;
`;

const MarkerLabel = styled.div`
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoWindowContent = styled.div`
  padding: 0;
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  margin: 0;
`;

const InfoBody = styled.div`
  padding: 0;
  margin: 0;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 6px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    margin: 0;
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const InfoLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  width: 16px;
  height: 16px;
`;

const InfoLabel = styled.span`
  color: #333333;
  margin: 0;
  font-weight: 500;
  font-size: 12px;
`;

const InfoValue = styled.span`
  color: #000000;
  font-weight: 600;
  margin: 0;
  font-size: 13px;
`;

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 37.459056,
  lng: 129.173353,
};

interface TubeTrailerMapProps {
  selectedVehicleId?: string;
  onMarkerClick?: (trailer: (typeof tubeTrailerMockData)[0]) => void;
}

const TubeTrailerMap: React.FC<TubeTrailerMapProps> = ({
  selectedVehicleId,
  onMarkerClick,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<
    (typeof tubeTrailerMockData)[0] | null
  >(null);

  // 지도 초기화 시 모든 마커가 보이도록 설정
  useEffect(() => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      tubeTrailerMockData.forEach((trailer) => {
        bounds.extend({ lat: trailer.lat, lng: trailer.lng });
      });
      map.fitBounds(bounds);

      // 줌 레벨 조정 (약간 줌 아웃)
      setTimeout(() => {
        map.setZoom(17);
      }, 100);
    }
  }, [map]);

  // 선택된 차량이 변경될 때 지도 이동
  useEffect(() => {
    if (map && selectedVehicleId) {
      const trailer = tubeTrailerMockData.find(
        (t) => t.id === selectedVehicleId
      );
      if (trailer) {
        map.panTo({ lat: trailer.lat, lng: trailer.lng });
        map.setZoom(18); // 선택 시에는 좀 더 자세히
        setSelectedTrailer(trailer);
      }
    }
  }, [selectedVehicleId, map]);

  // 지도 클릭 이벤트 핸들러 추가
  useEffect(() => {
    if (map) {
      const clickListener = map.addListener('click', () => {
        setSelectedTrailer(null);
      });
      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }
  }, [map]);

  if (loadError) {
    return <div>지도를 불러오는데 실패했습니다.</div>;
  }

  if (!isLoaded) {
    return <div>지도를 불러오는 중...</div>;
  }

  const handleMarkerClick = (trailer: (typeof tubeTrailerMockData)[0]) => {
    setSelectedTrailer(trailer);
    if (onMarkerClick) {
      onMarkerClick(trailer);
    }
    if (map) {
      map.panTo({ lat: trailer.lat, lng: trailer.lng });
      map.setZoom(18); // 마커 클릭 시에도 동일한 줌 레벨 유지
    }
  };

  return (
    <MapContainer>
      <GlobalStyle />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={17} // 초기 줌 레벨도 동일하게 조정
        onLoad={setMap}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeId: 'hybrid',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {tubeTrailerMockData.map((trailer) => (
          <MarkerF
            key={trailer.id}
            position={{ lat: trailer.lat, lng: trailer.lng }}
            onClick={() => handleMarkerClick(trailer)}
            label={{
              text: trailer.carNo,
              className: 'marker-label',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '600',
            }}
            icon={{
              path: 'M 0,-20 L 20,0 L 0,20 L -20,0 Z',
              fillColor: trailer.backgroundColor,
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#000000',
              scale: 1.5,
            }}
          />
        ))}

        {selectedTrailer && (
          <InfoWindow
            position={{ lat: selectedTrailer.lat, lng: selectedTrailer.lng }}
            options={{
              pixelOffset: new window.google.maps.Size(0, -20),
              disableAutoPan: false,
              maxWidth: 240,
              minWidth: 200,
            }}
          >
            <InfoWindowContent>
              <InfoBody>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Truck size={16} />
                    </InfoIcon>
                    <InfoLabel>차량번호</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      background: selectedTrailer.backgroundColor,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {selectedTrailer.carNo}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Link2 size={16} />
                    </InfoIcon>
                    <InfoLabel>커플링</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      color:
                        selectedTrailer.coupling === '비활성'
                          ? '#999999'
                          : '#000000',
                      fontWeight:
                        selectedTrailer.coupling === '비활성' ? 400 : 600,
                    }}
                  >
                    {selectedTrailer.coupling}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Anchor size={16} />
                    </InfoIcon>
                    <InfoLabel>랜딩기어(L)</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      color:
                        selectedTrailer.landingGearL === '비활성'
                          ? '#999999'
                          : '#000000',
                      fontWeight:
                        selectedTrailer.landingGearL === '비활성' ? 400 : 600,
                    }}
                  >
                    {selectedTrailer.landingGearL}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Anchor size={16} />
                    </InfoIcon>
                    <InfoLabel>랜딩기어(R)</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      color:
                        selectedTrailer.landingGearR === '비활성'
                          ? '#999999'
                          : '#000000',
                      fontWeight:
                        selectedTrailer.landingGearR === '비활성' ? 400 : 600,
                    }}
                  >
                    {selectedTrailer.landingGearR}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Disc size={16} />
                    </InfoIcon>
                    <InfoLabel>P/Brake</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      color:
                        selectedTrailer.tBrake === '비활성'
                          ? '#999999'
                          : '#000000',
                      fontWeight:
                        selectedTrailer.tBrake === '비활성' ? 400 : 600,
                    }}
                  >
                    {selectedTrailer.tBrake}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabelWrapper>
                    <InfoIcon>
                      <Droplets size={16} />
                    </InfoIcon>
                    <InfoLabel>가스감지기</InfoLabel>
                  </InfoLabelWrapper>
                  <InfoValue
                    style={{
                      color:
                        selectedTrailer.gasSensor === '비활성'
                          ? '#999999'
                          : '#000000',
                      fontWeight:
                        selectedTrailer.gasSensor === '비활성' ? 400 : 600,
                    }}
                  >
                    {selectedTrailer.gasSensor}
                  </InfoValue>
                </InfoRow>
              </InfoBody>
            </InfoWindowContent>
          </InfoWindow>
        )}
      </GoogleMap>
    </MapContainer>
  );
};

export default TubeTrailerMap;

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

const libraries: Libraries = ['places', 'marker'];

// InfoWindow 닫기 버튼 숨기기 위한 전역 스타일
const GlobalStyle = createGlobalStyle`
  .gm-ui-hover-effect {
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
  margin: -8px -12px;
  font-family: 'Pretendard', sans-serif;
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
`;

const InfoBody = styled.div`
  padding: 8px 12px;
  font-size: 13px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #666;
  margin-right: 12px;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
  font-weight: 500;
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
              maxWidth: 320,
            }}
          >
            <InfoWindowContent>
              <InfoTitle>차량 정보</InfoTitle>
              <InfoBody
                style={{ backgroundColor: selectedTrailer.backgroundColor }}
              >
                <InfoRow>
                  <InfoLabel>차량 번호</InfoLabel>
                  <InfoValue>{selectedTrailer.carNo}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>커플링</InfoLabel>
                  <InfoValue>{selectedTrailer.coupling}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>착지기어(좌)</InfoLabel>
                  <InfoValue>{selectedTrailer.landingGearL}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>착지기어(우)</InfoLabel>
                  <InfoValue>{selectedTrailer.landingGearR}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>T-브레이크</InfoLabel>
                  <InfoValue>{selectedTrailer.tBrake}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>가스센서</InfoLabel>
                  <InfoValue>{selectedTrailer.gasSensor}</InfoValue>
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

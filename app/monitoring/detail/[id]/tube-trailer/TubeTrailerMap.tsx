'use client';

import React, { useEffect, useRef } from 'react';

interface TubeTrailerMarker {
  id: string;
  carNo: string;
  coupling: string;
  landingGearL: string;
  landingGearR: string;
  tBrake: string;
  gasSensor: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  backgroundColor?: string;
  info?: string;
}

interface TubeTrailerMapProps {
  center: { latitude: number; longitude: number };
  markers: TubeTrailerMarker[];
  selectedVehicleId: string | null;
  onMarkerClick?: (id: string) => void;
}

const TubeTrailerMap = ({
  center,
  markers,
  selectedVehicleId,
  onMarkerClick,
}: TubeTrailerMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstances = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (!window.naver?.maps || !mapRef.current) return;

    // 지도 생성
    mapInstance.current = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(center.latitude, center.longitude),
      zoom: 14,
      mapTypeId: window.naver.maps.MapTypeId.SATELLITE,
    });

    // 마커 생성
    markerInstances.current = markers.map((marker) => {
      // 다이아몬드(회전 사각형) 마커 SVG (테두리 빛 효과 제거)
      const markerSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>
          <rect x='12' y='12' width='32' height='32' rx='6' fill='${
            marker.backgroundColor || '#ffd6e0'
          }' stroke='#111' stroke-width='4' transform='rotate(45 28 28)'/>
          <text x='50%' y='54%' text-anchor='middle' dominant-baseline='central' font-size='12' font-family='Pretendard,sans-serif' font-weight='bold' fill='#111'>${
            marker.carNo
          }</text>
        </svg>
      `;
      const markerIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        markerSvg
      )}`;
      // 10미터 아래(남쪽) + 3미터 왼쪽(서쪽)으로 이동: 위도(lat) -0.00009, 경도(lng) -0.000034
      const latOffset = 0.00009;
      const lngOffset = 0.000034;
      const nMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          (typeof marker.latitude === 'number'
            ? marker.latitude
            : typeof marker.lat === 'number'
            ? marker.lat
            : 0) - latOffset,
          (typeof marker.longitude === 'number'
            ? marker.longitude
            : typeof marker.lng === 'number'
            ? marker.lng
            : 0) - lngOffset
        ),
        map: mapInstance.current!,
        icon: {
          url: markerIconUrl,
          size: new window.naver.maps.Size(56, 56),
          scaledSize: new window.naver.maps.Size(56, 56),
        },
      });

      window.naver.maps.Event.addListener(nMarker, 'click', () => {
        if (onMarkerClick) onMarkerClick(marker.id);
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // 세련된 카드 스타일 InfoWindow
        const cardHtml = `
          <div style="
            font-family:'Pretendard',sans-serif;
            min-width:200px; max-width:270px;
            border-radius:40px;
            padding:14px 0 10px 0;
          ">
            <div style="display:flex;align-items:center;gap:8px;padding:0 20px 10px 20px;">
              <span style="font-size:20px;">🚚</span>
              <span style="font-size:14px;color:#6b7684;">차량번호</span>
              <span style="margin-left:auto;background:${
                marker.backgroundColor ?? '#ffd6e0'
              };color:#222;font-weight:800;padding:3px 14px;border-radius:9px;font-size:17px;box-shadow:0 1px 6px rgba(0,0,0,0.07);letter-spacing:1px;">${
          marker.carNo
        }</span>
            </div>
            <div style="border-top:1.5px solid #f1f3f7;margin:0 18px 0 18px;"></div>
            <div style="padding:8px 0 0 0;">
              <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
                <span style="font-size:16px;">🔗</span>
                <span style="font-size:13px;color:#6b7684;">커플링</span>
                <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
                  marker.coupling
                }</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
                <span style="font-size:16px;">⚓️</span>
                <span style="font-size:13px;color:#6b7684;">랜딩기어(L)</span>
                <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
                  marker.landingGearL
                }</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
                <span style="font-size:16px;">⚓️</span>
                <span style="font-size:13px;color:#6b7684;">랜딩기어(R)</span>
                <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
                  marker.landingGearR
                }</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
                <span style="font-size:16px;">⭕️</span>
                <span style="font-size:13px;color:#6b7684;">P/Brake</span>
                <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
                  marker.tBrake
                }</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
                <span style="font-size:16px;">🔥</span>
                <span style="font-size:13px;color:#6b7684;">가스감지기</span>
                <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
                  marker.gasSensor
                }</span>
              </div>
            </div>
          </div>
        `;
        infoWindowRef.current = new window.naver.maps.InfoWindow({
          content: cardHtml,
          maxWidth: 260,
        });
        infoWindowRef.current.open(mapInstance.current, nMarker);
      });

      return nMarker;
    });

    // 모든 마커가 보이도록 bounds 계산 및 적용
    if (markers.length > 0) {
      const first = markers[0];
      const bounds = new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(
          typeof first.latitude === 'number'
            ? first.latitude
            : typeof first.lat === 'number'
            ? first.lat
            : 0,
          typeof first.longitude === 'number'
            ? first.longitude
            : typeof first.lng === 'number'
            ? first.lng
            : 0
        ),
        new window.naver.maps.LatLng(
          typeof first.latitude === 'number'
            ? first.latitude
            : typeof first.lat === 'number'
            ? first.lat
            : 0,
          typeof first.longitude === 'number'
            ? first.longitude
            : typeof first.lng === 'number'
            ? first.lng
            : 0
        )
      );
      markers.forEach((marker) => {
        bounds.extend(
          new window.naver.maps.LatLng(
            typeof marker.latitude === 'number'
              ? marker.latitude
              : typeof marker.lat === 'number'
              ? marker.lat
              : 0,
            typeof marker.longitude === 'number'
              ? marker.longitude
              : typeof marker.lng === 'number'
              ? marker.lng
              : 0
          )
        );
      });
      mapInstance.current.fitBounds(bounds);
      // fitBounds 후 2단계 줌 아웃
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.setZoom(currentZoom - 2);
    }

    // 지도 클릭 시 말풍선 닫기
    if (window.naver?.maps && mapInstance.current) {
      const handleMapClick = () => {
        if (infoWindowRef.current) infoWindowRef.current.close();
      };
      const listener = window.naver.maps.Event.addListener(
        mapInstance.current,
        'click',
        handleMapClick
      );
      // cleanup 시 리스너 제거
      return () => {
        try {
          if (window.naver?.maps && mapInstance.current) {
            window.naver.maps.Event.removeListener(
              mapInstance.current,
              'click',
              handleMapClick
            );
          }
        } catch (e) {
          // 이미 destroy된 경우 등 예외 무시
        }
        markerInstances.current.forEach((m) => m.setMap(null));
        if (mapInstance.current) mapInstance.current.destroy();
        if (infoWindowRef.current) infoWindowRef.current.close();
      };
    }

    // 기존 cleanup
    return () => {
      markerInstances.current.forEach((m) => m.setMap(null));
      mapInstance.current?.destroy();
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
  }, [center, markers, selectedVehicleId, onMarkerClick]);

  useEffect(() => {
    if (
      !window.naver?.maps ||
      !mapInstance.current ||
      !markerInstances.current.length
    )
      return;
    if (!selectedVehicleId) {
      if (infoWindowRef.current) infoWindowRef.current.close();
      return;
    }
    const idx = markers.findIndex((m) => m.id === selectedVehicleId);
    if (idx === -1) return;
    const marker = markers[idx];
    const nMarker = markerInstances.current[idx];
    if (infoWindowRef.current) infoWindowRef.current.close();
    const cardHtml = `
      <div style="
        font-family:'Pretendard',sans-serif;
        min-width:200px; max-width:270px;
        border-radius:40px;
        padding:14px 0 10px 0;
      ">
        <div style="display:flex;align-items:center;gap:8px;padding:0 20px 10px 20px;">
          <span style="font-size:20px;">🚚</span>
          <span style="font-size:14px;color:#6b7684;">차량번호</span>
          <span style="margin-left:auto;background:${
            marker.backgroundColor ?? '#ffd6e0'
          };color:#222;font-weight:800;padding:3px 14px;border-radius:9px;font-size:17px;box-shadow:0 1px 6px rgba(0,0,0,0.07);letter-spacing:1px;">${
      marker.carNo
    }</span>
        </div>
        <div style="border-top:1.5px solid #f1f3f7;margin:0 18px 0 18px;"></div>
        <div style="padding:8px 0 0 0;">
          <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
            <span style="font-size:16px;">🔗</span>
            <span style="font-size:13px;color:#6b7684;">커플링</span>
            <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
              marker.coupling
            }</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
            <span style="font-size:16px;">⚓️</span>
            <span style="font-size:13px;color:#6b7684;">랜딩기어(L)</span>
            <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
              marker.landingGearL
            }</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
            <span style="font-size:16px;">⚓️</span>
            <span style="font-size:13px;color:#6b7684;">랜딩기어(R)</span>
            <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
              marker.landingGearR
            }</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
            <span style="font-size:16px;">⭕️</span>
            <span style="font-size:13px;color:#6b7684;">P/Brake</span>
            <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
              marker.tBrake
            }</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:7px 20px;">
            <span style="font-size:16px;">🔥</span>
            <span style="font-size:13px;color:#6b7684;">가스감지기</span>
            <span style="margin-left:auto;font-size:13px;color:#3b4252;font-weight:600;">${
              marker.gasSensor
            }</span>
          </div>
        </div>
      </div>
    `;
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: cardHtml,
      maxWidth: 260,
    });
    infoWindowRef.current.open(mapInstance.current, nMarker);
  }, [selectedVehicleId, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default TubeTrailerMap;

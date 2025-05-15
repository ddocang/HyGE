'use client';

import { useEffect, useRef } from 'react';

export default function useWebSocket(
  url: string,
  onMessage: (data: any) => void
) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
      // 필요한 경우 여기에서 subscribe 메시지 보낼 수 있음
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const topicId = data?.mqtt_data?.topic_id;
        if (topicId === 'BASE/P001' || topicId === 'BASE/P003') {
          const mqtt = data?.mqtt_data?.data;
          console.log('🔥 원본:', mqtt);

          if (mqtt) {
            const gdet = mqtt.gdet;
            const fdet = mqtt.fdet;

            console.log(
              '🟢 gdet(가스감지기):',
              gdet === 0 ? '정상' : gdet === 1 ? '위험' : gdet,
              '🔴 fdet(화재감지기):',
              fdet === 0 ? '정상' : fdet === 1 ? '위험' : fdet
            );
          }

          onMessage(data);
        }
      } catch (e) {
        console.error('⚠️ JSON 파싱 실패:', e);
      }
    };

    ws.current.onerror = (err) => {
      console.error('❌ WebSocket 오류:', err);
    };

    ws.current.onclose = () => {
      console.log('🔒 WebSocket 연결 종료');
    };

    return () => {
      ws.current?.close();
    };
  }, [url, onMessage]);
}

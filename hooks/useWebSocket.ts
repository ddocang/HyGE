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
      // 필요한 경우 여기에서 subscribe 메시지 보낼 수 있음
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const topicId = data?.mqtt_data?.topic_id;
        if (topicId === 'BASE/P001' || topicId === 'BASE/P003') {
          const mqtt = data?.mqtt_data?.data;

          if (mqtt) {
            const gdet = mqtt.gdet;
            const fdet = mqtt.fdet;

            onMessage(data);
          }
        }
      } catch (e) {
        // 🔒 JSON 파싱 실패 로그 제거
      }
    };

    ws.current.onerror = (err) => {
      // 🔒 WebSocket 오류 로그 제거
    };

    ws.current.onclose = () => {
      // 🔒 WebSocket 연결 종료 로그 제거
    };

    return () => {
      ws.current?.close();
    };
  }, [url, onMessage]);
}

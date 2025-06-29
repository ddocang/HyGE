const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// WebSocket 클라이언트 연결 (외부 실시간 서버 주소 사용)
let ws;
function connectWebSocket() {
  ws = new WebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev'
  );

  // 하트비트용 Interval ID
  let heartbeatInterval;

  ws.on('open', () => {
    console.log('✅ WebSocket 연결 성공:', new Date().toISOString());
    // 30초마다 하트비트 로그 찍기
    heartbeatInterval = setInterval(() => {
      console.log('💓 heartbeat:', new Date().toISOString());
    }, 30000);
  });

  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data);
      // BASE/P001, BASE/P003만 저장
      if (
        parsed?.mqtt_data?.topic_id === 'BASE/P001' ||
        parsed?.mqtt_data?.topic_id === 'BASE/P003'
      ) {
        let barr = parsed?.mqtt_data?.data?.barr;
        if (typeof barr === 'string') {
          const arr = barr.split(',');
          if (parsed?.mqtt_data?.topic_id === 'BASE/P001') {
            barr = arr.slice(0, 9).join(',');
          } else if (parsed?.mqtt_data?.topic_id === 'BASE/P003') {
            barr = arr.slice(0, 3).join(',');
          }
        }
        const filtered = {
          topic_id: parsed?.mqtt_data?.topic_id,
          last_update_time: parsed?.mqtt_data?.data?.last_update_time,
          barr,
          gdet: parsed?.mqtt_data?.data?.gdet,
          fdet: parsed?.mqtt_data?.data?.fdet,
        };
        const { error } = await supabase
          .from('realtime_data')
          .insert([filtered]);
        if (error) {
          // console.error('Supabase 저장 에러:', error);
        } else {
          // console.log('Supabase 저장 성공:', filtered);
        }
      }
    } catch (e) {
      // console.error('파싱/저장 에러:', e);
    }
  });

  ws.on('close', () => {
    console.log('🔒 WebSocket 연결 종료:', new Date().toISOString());
    clearInterval(heartbeatInterval);
    setTimeout(connectWebSocket, 5000);
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket 오류:', err);
    clearInterval(heartbeatInterval);
    try {
      ws.close();
    } catch (e) {}
  });
}

connectWebSocket();

// API 엔드포인트 예시
app.get('/', (req, res) => {
  res.send('Express + WebSocket 서버 정상 동작 중!');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // console.log(`서버가 ${PORT}번 포트에서 실행 중`);
});

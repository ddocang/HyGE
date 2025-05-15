// Supabase REST API fetch 직접 호출 테스트
// Node.js 18+ 환경에서 실행 가능 (fetch 내장)

const API_URL =
  'https://wxsmvftivxerlchikwpl.supabase.co/rest/v1/realtime_data';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M';

(async () => {
  try {
    const res = await fetch(API_URL + '?select=*', {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const data = await res.json();
    console.log('✅ fetch 성공:', data);
  } catch (err) {
    console.error('❌ fetch 에러:', err);
  }
})();

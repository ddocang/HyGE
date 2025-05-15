// Supabase-js createClient anon key 확인 테스트
// fetch 테스트와 동일한 key인지 확인

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wxsmvftivxerlchikwpl.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M';

console.log('Supabase anon key:', JSON.stringify(supabaseAnonKey));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const { data, error } = await supabase
    .from('realtime_data')
    .select('*')
    .limit(1);
  if (error) {
    console.error('❌ Supabase-js fetch 에러:', error);
  } else {
    console.log('✅ Supabase-js fetch 성공:', data);
  }
})();

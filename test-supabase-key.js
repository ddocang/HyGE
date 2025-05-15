// Supabase anon key ISO-8859-1 문자 범위 테스트
// 환경변수 SUPABASE_KEY를 사용하거나, 직접 anon key를 입력하세요.

// 1. 환경변수에서 읽기 (주석 처리)
// const testString = process.env.SUPABASE_KEY;
// 2. 직접 입력 테스트 (아래에 anon key를 입력)
const testString =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M';

if (!testString) {
  console.error('❗️ anon key가 비어있습니다.');
  process.exit(1);
}

if (/[^\u0000-\u00ff]/.test(testString)) {
  console.error('❌ ISO-8859-1(라틴1) 범위를 벗어난 문자가 포함되어 있습니다.');
} else {
  console.log('✅ 모든 문자가 ISO-8859-1(라틴1) 범위 내에 있습니다.');
}

console.log('실제 값:', JSON.stringify(testString));

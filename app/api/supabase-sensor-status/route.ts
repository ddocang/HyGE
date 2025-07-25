import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  // 모든 console.log, console.error, console.warn 제거

  // 환경 변수 대신 하드코딩된 값 사용
  const supabaseUrl = 'https://wxsmvftivxerlchikwpl.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M';

  try {
    // 모든 console.log, console.error, console.warn 제거

    console.log('Supabase 클라이언트 생성');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 각 토픽별로 가장 최신 데이터 조회 (P001, P003)
    const topics = ['BASE/P001', 'BASE/P003'];
    const results = [];

    for (const topic of topics) {
      // 모든 console.log, console.error, console.warn 제거

      // 상세페이지와 동일하게 필드 선택
      const { data, error } = await supabase
        .from('realtime_data')
        .select('last_update_time, barr, gdet, fdet, topic_id')
        .eq('topic_id', topic)
        .order('last_update_time', { ascending: false })
        .limit(1);

      // 모든 console.log, console.error, console.warn 제거

      if (error) {
        // 모든 console.error 제거
      } else if (data && data.length > 0) {
        // 모든 console.log 제거
        // mqtt_data 형식과 일치시키기
        const formattedData = {
          topic_id: topic,
          data: {
            barr: data[0].barr,
            gdet: data[0].gdet,
            fdet: data[0].fdet,
            last_update_time: data[0].last_update_time,
          },
        };
        results.push(formattedData);
      }
    }

    console.log('최종 결과 데이터 수:', results.length);
    return NextResponse.json({ data: results });
  } catch (error: any) {
    // 모든 console.error 제거
    return NextResponse.json(
      {
        error: '센서 데이터 조회 중 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

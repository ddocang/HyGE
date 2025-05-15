import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wxsmvftivxerlchikwpl.supabase.co', // SUPABASE_URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M' // SUPABASE_KEY (프론트엔드는 anon key 사용)
);

type RealtimeData = {
  topic_id: string;
  last_update_time: string;
  barr: string;
  gdet: string;
  fdet: string;
  // 필요한 필드가 있으면 추가
};

export default function SupaMonitoringPage() {
  const [data, setData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('realtime_data')
        .select('*')
        .order('last_update_time', { ascending: false })
        .limit(10);
      if (!error) setData(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Supabase에서 가져온 실시간 데이터 (최근 10개)</h2>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>topic_id</th>
              <th>last_update_time</th>
              <th>barr</th>
              <th>gdet</th>
              <th>fdet</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any) => (
              <tr key={row.id}>
                <td>{row.topic_id}</td>
                <td>{row.last_update_time}</td>
                <td>{row.barr}</td>
                <td>{row.gdet}</td>
                <td>{row.fdet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

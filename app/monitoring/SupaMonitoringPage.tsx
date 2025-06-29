import { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';

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

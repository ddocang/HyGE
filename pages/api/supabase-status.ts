import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL || 'https://wxsmvftivxerlchikwpl.supabase.co';
const supabaseKey =
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    // 최신 데이터 1개만 조회 (topic_id 등 조건은 필요에 따라 추가)
    const { data, error } = await supabase
      .from('realtime_data')
      .select('id, gas_status, fire_status, vibration_status, last_update_time')
      .order('last_update_time', { ascending: false })
      .limit(1)
      .single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

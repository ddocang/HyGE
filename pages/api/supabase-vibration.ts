import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// 환경변수에서 안전하게 읽기 (NEXT_PUBLIC_ 아님!)
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
    const { data, error } = await supabase
      .from('realtime_data')
      .select('last_update_time, barr')
      .eq('topic_id', 'BASE/P001')
      .order('last_update_time', { ascending: false })
      .limit(100);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

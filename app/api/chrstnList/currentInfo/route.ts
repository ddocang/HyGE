import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(
      'http://el.h2nbiz.or.kr/api/chrstnList/currentInfo',
      {
        headers: {
          Authorization: process.env.H2_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

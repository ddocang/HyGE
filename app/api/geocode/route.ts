import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 원래 지도용 키로 변경
const NCP_CLIENT_ID = '9biw41sxac';
const NCP_CLIENT_SECRET = 'BnKn4YXlTaAEgHmqdVWdj2SMVmQSXodk7iiPbQaQ';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // 정방향 지오코딩 (주소 → 좌표)
  if (query) {
    try {
      const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
        query
      )}`;
      console.log('Geocoding 요청 URL:', url);

      const response = await fetch(url, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NCP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NCP_CLIENT_SECRET,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Geocoding API 오류:', {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText,
        });
        return NextResponse.json(
          { error: '주소 검색에 실패했습니다.' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('주소 검색 중 오류:', error);
      return NextResponse.json(
        { error: '주소 검색에 실패했습니다.' },
        { status: 500 }
      );
    }
  }

  // 역지오코딩 (좌표 → 주소)
  if (lat && lng) {
    try {
      const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json&orders=addr,roadaddr`;
      console.log('역지오코딩 요청 URL:', url);

      const response = await fetch(url, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NCP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NCP_CLIENT_SECRET,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('역지오코딩 API 오류:', {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText,
        });
        return NextResponse.json(
          { error: '주소 변환에 실패했습니다.' },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('역지오코딩 API 응답:', data);

      // 네이버 역지오코딩 API 응답을 클라이언트가 기대하는 형식으로 변환
      const results = [];

      if (data.results && data.results.length > 0) {
        // 도로명 주소가 있으면 우선 사용
        const roadAddr = data.results.find((r: any) => r.name === 'roadaddr');
        const jibunAddr = data.results.find((r: any) => r.name === 'addr');

        if (roadAddr) {
          results.push({
            region: {
              area1: { name: roadAddr.region.area1.name },
              area2: { name: roadAddr.region.area2.name },
              area3: { name: roadAddr.region.area3.name },
              area4: { name: roadAddr.region.area4.name },
            },
          });
        } else if (jibunAddr) {
          results.push({
            region: {
              area1: { name: jibunAddr.region.area1.name },
              area2: { name: jibunAddr.region.area2.name },
              area3: { name: jibunAddr.region.area3.name },
              area4: { name: jibunAddr.region.area4.name },
            },
          });
        }
      }

      return NextResponse.json({ results });
    } catch (error) {
      console.error('주소 변환 중 오류:', error);
      return NextResponse.json(
        { error: '주소 변환에 실패했습니다.' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: '주소 검색어(query) 또는 좌표(lat, lng)가 필요합니다.' },
    { status: 400 }
  );
}

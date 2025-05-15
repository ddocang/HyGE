const axios = require('axios');

const clientId = '9biw41sxac'; // 네이버 클라이언트 ID
const clientSecret = 'BnKn4YXlTaAEgHmqdVWdj2SMVmQSXodk7iiPbQaQ'; // 네이버 클라이언트 시크릿

const searchPlace = async (query) => {
  try {
    const response = await axios.get(
      'https://openapi.naver.com/v1/search/local.json',
      {
        params: {
          query: query,
          display: 1,
        },
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    );

    const items = response.data.items;
    if (items.length > 0) {
      const { mapx, mapy } = items[0];
      console.log(`Coordinates for ${query}: (${mapx}, ${mapy})`);
    } else {
      console.log(`No results found for ${query}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 각 충전소 이름으로 검색
searchPlace('삼척교동수소스테이션');
searchPlace('삼척수소충전소');
searchPlace('속초수소충전소');
searchPlace('동해휴게소수소충전소');
searchPlace('원주수소충전소');

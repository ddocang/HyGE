import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import KoreaMap from '../../map/KoreaMap';

interface StyledProps {
  $isActive?: boolean;
}

interface PriceData {
  current: string;
  high: string;
  low: string;
}

type RegionType =
  | '서울'
  | '부산'
  | '대구'
  | '인천'
  | '광주'
  | '대전'
  | '울산'
  | '세종'
  | '강원'
  | '경기'
  | '충북'
  | '충남'
  | '전북'
  | '전남'
  | '경북'
  | '경남'
  | '제주'
  | '전국평균';

type RegionData = Record<RegionType, PriceData>;

const Container = styled.section`
  width: 100%;
  height: auto;
  background-color: #666b70;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1280px;
  width: 100%;

  @media (max-width: 1366px) {
    gap: 20px;
    margin-top: 32px;
  }

  @media (max-width: 768px) {
    gap: 16px;
    margin-top: 24px;
  }
`;

const SectionTitle = styled.div`
  text-align: center;
`;

const MainTitle = styled.h1`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 48px;
  line-height: 57.6px;
  color: #ffffff;

  @media (max-width: 1366px) {
    font-size: 40px;
    line-height: 48px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 38.4px;
  }
`;

const PriceCard = styled.div`
  width: 894px;
  background: #ffffff;
  border-radius: 36px;
  padding: 28px 44px;
  position: relative;

  @media (max-width: 1366px) {
    width: 100%;
    max-width: 894px;
    padding: 24px 32px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 24px;
  }
`;

const EnvironmentCard = styled.div`
  width: 362px;
  background: #ffffff;
  border-radius: 36px;
  padding: 28px;
  position: relative;
  z-index: 2;

  @media (max-width: 1366px) {
    width: 100%;
    max-width: 362px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 24px;
    margin-top: 16px;
  }
`;

const Title = styled.h2`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 28px;
  line-height: 33.6px;
  color: #373737;
  margin-left: -15px;

  ${EnvironmentCard} & {
    margin-left: 0;
    text-align: center;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 28.8px;
    margin-left: 0;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 35px;

  @media (max-width: 1366px) {
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 365px;

  @media (max-width: 1366px) {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 185px;
  height: 40px;
  padding: 0 15px;
  border: 2px solid #00b5d8;
  border-radius: 20px;
  font-family: 'Pretendard';
  font-size: 16px;
  outline: none;
  text-align: center;

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 36px;
    font-size: 14px;
  }
`;

const UpdateTime = styled.p`
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: 16px;
  line-height: 19.2px;
  color: #6d6d6d;
  position: absolute;
  right: 110px;
  top: 34px;
  z-index: 2;

  @media (max-width: 1366px) {
    right: 32px;
  }

  @media (max-width: 768px) {
    position: static;
    margin: 0;
    font-size: 14px;
    text-align: center;
    order: 2;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 22px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  overflow: visible;

  @media (max-width: 1366px) {
    gap: 24px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }
`;

const MapArea = styled.div`
  width: 100%;
  max-width: 346px;
  height: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  z-index: 1;

  @media (max-width: 1366px) {
    height: 380px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 280px;
    margin: 24px 0 32px;
    order: 2;
  }
`;

const PriceInfoArea = styled.div`
  width: 100%;
  max-width: 391px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
    order: 1;
  }
`;

const PriceBox = styled.div<StyledProps>`
  width: 100%;
  height: 210px;
  background: ${(props: StyledProps) =>
    props.$isActive ? '#F0F9FF' : '#f9f9f9'};
  border-radius: 20px;
  padding: 24px;
  border: ${(props: StyledProps) =>
    props.$isActive ? '1px solid #00B5D8' : 'none'};

  @media (max-width: 768px) {
    height: auto;
    min-height: 160px;
    padding: 16px;
  }
`;

const BoxTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BoxTitleText = styled.span`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #373737;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 21.6px;
  }
`;

const RegionText = styled(BoxTitleText)`
  color: #00b5d8;
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 34px;
  margin-bottom: 24px;
`;

const Price = styled.span`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 56px;
  line-height: 67.2px;
  letter-spacing: -1.12px;
  color: #111111;
  text-align: right;
  min-width: 150px;

  @media (max-width: 1366px) {
    font-size: 48px;
    line-height: 57.6px;
  }

  @media (max-width: 768px) {
    font-size: 40px;
    line-height: 48px;
    min-width: 120px;
  }
`;

const Unit = styled.span`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #111111;
  margin-left: 4px;
  margin-bottom: 10px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const PriceLabel = styled.span`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 16px;
  line-height: 19.2px;
  color: #111111;
`;

const HighPrice = styled.span`
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: 16px;
  line-height: 19.2px;
  color: #f73333;
  display: flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid #f73333;
  }
`;

const LowPrice = styled.span`
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: 16px;
  line-height: 19.2px;
  color: #338bf7;
  display: flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #338bf7;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 14px;
  background-color: #d3d3d3;
`;

const StationList = styled.div`
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;

  @media (max-width: 1366px) {
    max-height: 350px;
  }

  @media (max-width: 768px) {
    max-height: 250px;
    padding-right: 8px;
    margin-top: 16px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const StationItem = styled.div`
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 8px;
  }
`;

const StationName = styled.div`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 16px;
  line-height: 19.2px;
  color: #111111;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 16.8px;
  }
`;

const StationInfo = styled.div`
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: 14px;
  line-height: 16.8px;
  color: #666666;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 14.4px;
  }
`;

const StationPrice = styled.div`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 16px;
  line-height: 19.2px;
  color: #00b5d8;
  margin: 8px 0;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 16.8px;
    margin: 6px 0;
  }
`;

const StationStatus = styled.div<{ $isOperating?: boolean }>`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 14px;
  line-height: 16.8px;
  color: ${(props) => (props.$isOperating ? '#00b5d8' : '#f73333')};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #ffffff;
  gap: 16px;
`;

const LoadingText = styled.div`
  font-family: 'Pretendard';
  font-size: 18px;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00b5d8;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PressureStatus = styled.span<{
  $status: 'sufficient' | 'moderate' | 'low';
}>`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 14px;
  margin-left: 8px;
  color: ${(props) => {
    switch (props.$status) {
      case 'sufficient':
        return '#00b5d8';
      case 'moderate':
        return '#f7a233';
      case 'low':
        return '#f73333';
      default:
        return '#666666';
    }
  }};
`;

const getRegionFromAddress = (address: string): string | null => {
  const regionMap: { [key: string]: string } = {
    서울특별시: '서울',
    서울: '서울',
    부산광역시: '부산',
    부산: '부산',
    대구광역시: '대구',
    대구: '대구',
    인천광역시: '인천',
    인천: '인천',
    광주광역시: '광주',
    광주: '광주',
    대전광역시: '대전',
    대전: '대전',
    울산광역시: '울산',
    울산: '울산',
    세종특별자치시: '세종',
    세종: '세종',
    경기도: '경기',
    경기: '경기',
    강원특별자치도: '강원',
    강원도: '강원',
    강원: '강원',
    충청북도: '충북',
    충북: '충북',
    충청남도: '충남',
    충남: '충남',
    전라북도: '전북',
    전북특별자치도: '전북',
    전북: '전북',
    전라남도: '전남',
    전남: '전남',
    경상북도: '경북',
    경북: '경북',
    경상남도: '경남',
    경남: '경남',
    제주특별자치도: '제주',
    제주도: '제주',
    제주: '제주',
  };

  // 주소에서 첫 번째 공백 이전의 텍스트를 추출
  const firstPart = address.split(' ')[0];

  // 직접 매핑 시도
  if (regionMap[firstPart]) {
    return regionMap[firstPart];
  }

  // 광역시/특별시/도 단위로 매핑
  for (const [key, value] of Object.entries(regionMap)) {
    if (address.startsWith(key)) {
      return value;
    }
  }

  // 주소가 "시/군/구"로 시작하는 경우를 위한 추가 처리
  for (const [key, value] of Object.entries(regionMap)) {
    if (address.includes(key)) {
      return value;
    }
  }

  return null;
};

const PriceSection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('서울');
  const [priceData, setPriceData] = useState<RegionData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [stationList, setStationList] = useState<any[]>([]);
  const [allStations, setAllStations] = useState<any[]>([]);
  const [stationsByRegion, setStationsByRegion] = useState<{
    [key: string]: any[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<any[]>([]);
  const stationListRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 실시간 정보 API 호출
        const currentResponse = await fetch('/api/chrstnList/currentInfo');
        const currentData = await currentResponse.json();

        // 실시간 정보를 충전소 이름을 키로 하여 객체로 변환
        const realTimeData = Array.isArray(currentData)
          ? currentData.reduce((acc: any, item: any) => {
              if (item.chrstn_nm) {
                acc[item.chrstn_nm] = {
                  chrg_sttus: item.chrg_sttus,
                  wait_vhcle_alge: item.wait_vhcle_alge,
                  tt_pressr: item.tt_pressr,
                  updt_dt: item.updt_dt,
                };
              }
              return acc;
            }, {})
          : {};

        // 운영 정보 API 호출
        const operationResponse = await fetch('/api/chrstnList/operationInfo');
        const operationData = await operationResponse.json();
        const stations = Array.isArray(operationData) ? operationData : [];

        // 지역별 데이터 그룹화
        const groupedData: { [key: string]: number[] } = {};
        const tempStationsByRegion: { [key: string]: any[] } = {};
        const allStationsData: any[] = [];

        stations.forEach((item: any) => {
          const address = item.road_nm_addr || item.lotno_addr;
          const region = getRegionFromAddress(address);

          if (!region) {
            return;
          }

          const price = parseInt(item.ntsl_pc);
          if (isNaN(price)) {
            return;
          }

          if (!groupedData[region]) {
            groupedData[region] = [];
            tempStationsByRegion[region] = [];
          }
          groupedData[region].push(price);

          // 실시간 정보 병합 (충전소 이름으로 매핑)
          const realTimeStation = realTimeData[item.chrstn_nm] || {};

          const mergedStation = {
            ...item,
            realTimeInfo: realTimeStation,
            isCharging: realTimeStation.chrg_sttus === 'Y',
            waitingCount: parseInt(realTimeStation.wait_vhcle_alge || '0'),
            pressure: realTimeStation.tt_pressr
              ? Math.floor(parseInt(realTimeStation.tt_pressr) / 10)
              : null,
            lastUpdateTime: realTimeStation.updt_dt || '-',
            price: parseInt(item.ntsl_pc || '0'),
            operationStatus: item.oper_yn === 'Y' ? '운영중' : '운영중지',
            address: item.road_nm_addr || item.lotno_addr || '-',
            contact: item.chrstn_cttpc || '-',
            name: item.chrstn_nm || '이름 없음',
            region: region,
          };

          tempStationsByRegion[region].push(mergedStation);
          allStationsData.push(mergedStation);
        });

        // 지역별 데이터 처리
        const formattedData: RegionData = {} as RegionData;

        Object.entries(groupedData).forEach(([region, prices]) => {
          const current = Math.round(
            prices.reduce((a, b) => a + b, 0) / prices.length
          );
          const high = Math.max(...prices);
          const low = Math.min(...prices);

          formattedData[region as RegionType] = {
            current: current.toLocaleString(),
            high: high.toLocaleString(),
            low: low.toLocaleString(),
          };
        });

        // 전국 평균 계산
        const allPrices = Object.values(groupedData).flat();
        const avgPrice = Math.round(
          allPrices.reduce((a, b) => a + b, 0) / allPrices.length
        );

        formattedData['전국평균'] = {
          current: avgPrice.toLocaleString(),
          high: Math.max(...allPrices).toLocaleString(),
          low: Math.min(...allPrices).toLocaleString(),
        };

        setPriceData(formattedData);
        setStationsByRegion(tempStationsByRegion);
        setAllStations(allStationsData);
        setStationList(tempStationsByRegion[selectedRegion] || []);
        setLastUpdate(new Date().toLocaleString());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().replace(/\s/g, '');
      const filtered = allStations.filter((station) => {
        const stationName = (station.name || '')
          .toLowerCase()
          .replace(/\s/g, '');
        const stationAddress = (station.address || '')
          .toLowerCase()
          .replace(/\s/g, '');

        return (
          stationName.includes(searchLower) ||
          stationAddress.includes(searchLower)
        );
      });
      setFilteredStations(filtered);

      // 검색어에서 지역을 찾아서 지도 업데이트
      const regionFromSearch = getRegionFromSearchTerm(searchTerm);
      if (regionFromSearch) {
        setSelectedRegion(regionFromSearch as RegionType);
      } else if (filtered.length > 0) {
        setSelectedRegion(filtered[0].region as RegionType);
      }
    } else {
      setFilteredStations([]);
      setStationList(stationsByRegion[selectedRegion] || []);
    }

    // 스크롤을 최상단으로 이동
    if (stationListRef.current) {
      stationListRef.current.scrollTop = 0;
    }
  }, [searchTerm, allStations, stationsByRegion, selectedRegion]);

  useEffect(() => {
    if (!searchTerm) {
      setStationList(stationsByRegion[selectedRegion] || []);
    }
  }, [selectedRegion, stationsByRegion, searchTerm]);

  const getDisplayStations = () => {
    if (searchTerm) {
      return filteredStations;
    }
    return stationList;
  };

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region as RegionType);
    setSearchTerm('');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getRegionFromSearchTerm = (searchTerm: string): string | null => {
    const regionMap: { [key: string]: string } = {
      서울특별시: '서울',
      서울: '서울',
      부산광역시: '부산',
      부산: '부산',
      대구광역시: '대구',
      대구: '대구',
      인천광역시: '인천',
      인천: '인천',
      광주광역시: '광주',
      광주: '광주',
      대전광역시: '대전',
      대전: '대전',
      울산광역시: '울산',
      울산: '울산',
      세종특별자치시: '세종',
      세종: '세종',
      경기도: '경기',
      경기: '경기',
      강원특별자치도: '강원',
      강원도: '강원',
      강원: '강원',
      충청북도: '충북',
      충북: '충북',
      충청남도: '충남',
      충남: '충남',
      전라북도: '전북',
      전북특별자치도: '전북',
      전북: '전북',
      전라남도: '전남',
      전남: '전남',
      경상북도: '경북',
      경북: '경북',
      경상남도: '경남',
      경남: '경남',
      제주특별자치도: '제주',
      제주도: '제주',
      제주: '제주',
    };

    const cityMap: { [key: string]: string } = {
      // 강원도
      원주: '강원',
      춘천: '강원',
      강릉: '강원',
      동해: '강원',
      속초: '강원',
      삼척: '강원',
      태백: '강원',
      홍천: '강원',
      횡성: '강원',
      영월: '강원',
      평창: '강원',
      정선: '강원',
      철원: '강원',
      화천: '강원',
      양구: '강원',
      인제: '강원',
      강원고성: '강원',
      양양: '강원',
      // 경기도
      수원: '경기',
      성남: '경기',
      의정부: '경기',
      안양: '경기',
      부천: '경기',
      광명: '경기',
      평택: '경기',
      동두천: '경기',
      안산: '경기',
      고양: '경기',
      과천: '경기',
      구리: '경기',
      남양주: '경기',
      오산: '경기',
      시흥: '경기',
      군포: '경기',
      의왕: '경기',
      하남: '경기',
      용인: '경기',
      파주: '경기',
      이천: '경기',
      안성: '경기',
      김포: '경기',
      화성: '경기',
      경기광주: '경기',
      양주: '경기',
      포천: '경기',
      여주: '경기',
      // 충청북도
      청주: '충북',
      충주: '충북',
      제천: '충북',
      보은: '충북',
      옥천: '충북',
      영동: '충북',
      증평: '충북',
      진천: '충북',
      괴산: '충북',
      음성: '충북',
      단양: '충북',
      // 충청남도
      천안: '충남',
      공주: '충남',
      보령: '충남',
      아산: '충남',
      서산: '충남',
      논산: '충남',
      계룡: '충남',
      당진: '충남',
      금산: '충남',
      부여: '충남',
      서천: '충남',
      청양: '충남',
      홍성: '충남',
      예산: '충남',
      태안: '충남',
      // 전라북도
      전주: '전북',
      군산: '전북',
      익산: '전북',
      정읍: '전북',
      남원: '전북',
      김제: '전북',
      완주: '전북',
      진안: '전북',
      무주: '전북',
      장수: '전북',
      임실: '전북',
      순창: '전북',
      고창: '전북',
      부안: '전북',
      // 전라남도
      목포: '전남',
      여수: '전남',
      순천: '전남',
      나주: '전남',
      광양: '전남',
      담양: '전남',
      곡성: '전남',
      구례: '전남',
      고흥: '전남',
      보성: '전남',
      화순: '전남',
      장흥: '전남',
      강진: '전남',
      해남: '전남',
      영암: '전남',
      무안: '전남',
      함평: '전남',
      영광: '전남',
      장성: '전남',
      완도: '전남',
      진도: '전남',
      신안: '전남',
      // 경상북도
      포항: '경북',
      경주: '경북',
      김천: '경북',
      안동: '경북',
      구미: '경북',
      영주: '경북',
      영천: '경북',
      상주: '경북',
      문경: '경북',
      경산: '경북',
      군위: '경북',
      의성: '경북',
      청송: '경북',
      영양: '경북',
      영덕: '경북',
      청도: '경북',
      고령: '경북',
      성주: '경북',
      칠곡: '경북',
      예천: '경북',
      봉화: '경북',
      울진: '경북',
      울릉: '경북',
      // 경상남도
      창원: '경남',
      진주: '경남',
      통영: '경남',
      사천: '경남',
      김해: '경남',
      밀양: '경남',
      거제: '경남',
      양산: '경남',
      의령: '경남',
      함안: '경남',
      창녕: '경남',
      경남고성: '경남',
      남해: '경남',
      하동: '경남',
      산청: '경남',
      함양: '경남',
      거창: '경남',
      합천: '경남',
    };

    const searchWords = searchTerm.split(' ');

    // 검색어의 각 단어를 확인
    for (const word of searchWords) {
      // 시/군/구 매핑 확인
      if (cityMap[word]) {
        return cityMap[word];
      }
      // 지역 매핑 확인
      if (regionMap[word]) {
        return regionMap[word];
      }
    }

    // 전체 검색어에서 지역명 확인
    for (const [key, value] of Object.entries(regionMap)) {
      if (searchTerm.includes(key)) {
        return value;
      }
    }

    // 전체 검색어에서 시/군/구 확인
    for (const [key, value] of Object.entries(cityMap)) {
      if (searchTerm.includes(key)) {
        return value;
      }
    }

    return null;
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>수소 충전소 정보를 불러오는 중입니다...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!priceData) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>데이터를 불러오는데 실패했습니다.</LoadingText>
          <LoadingText>잠시 후 다시 시도해주세요.</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>
        <MainTitle>HYDROGEN PRICE</MainTitle>
      </SectionTitle>
      <CardContainer>
        <PriceCard>
          <TitleContainer>
            <Title>실시간 수소 가격</Title>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="충전소 검색"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchContainer>
            <UpdateTime>{lastUpdate} 기준</UpdateTime>
          </TitleContainer>
          <InfoContainer>
            <PriceInfoArea>
              <PriceBox $isActive={true}>
                <BoxTitle>
                  <BoxTitleText>지역별</BoxTitleText>
                  <RegionText>{selectedRegion}</RegionText>
                </BoxTitle>
                <PriceDisplay>
                  <Price>{priceData[selectedRegion]?.current || '-'}</Price>
                  <Unit>원</Unit>
                </PriceDisplay>
                <PriceInfo>
                  <PriceLabel>최고</PriceLabel>
                  <HighPrice>
                    {priceData[selectedRegion]?.high || '-'}원
                  </HighPrice>
                  <Divider />
                  <PriceLabel>최저</PriceLabel>
                  <LowPrice>{priceData[selectedRegion]?.low || '-'}원</LowPrice>
                </PriceInfo>
              </PriceBox>
              <PriceBox>
                <BoxTitle>
                  <BoxTitleText>전국 평균</BoxTitleText>
                </BoxTitle>
                <PriceDisplay>
                  <Price>{priceData['전국평균']?.current || '-'}</Price>
                  <Unit>원</Unit>
                </PriceDisplay>
                <PriceInfo>
                  <PriceLabel>최고</PriceLabel>
                  <HighPrice>{priceData['전국평균']?.high || '-'}원</HighPrice>
                  <Divider />
                  <PriceLabel>최저</PriceLabel>
                  <LowPrice>{priceData['전국평균']?.low || '-'}원</LowPrice>
                </PriceInfo>
              </PriceBox>
            </PriceInfoArea>
            <MapArea>
              <KoreaMap
                selectedRegion={selectedRegion}
                onRegionClick={handleRegionClick}
              />
            </MapArea>
          </InfoContainer>
        </PriceCard>
        <EnvironmentCard>
          <Title>{selectedRegion} 수소충전소 목록</Title>
          <StationList ref={stationListRef}>
            {getDisplayStations().map((station, index) => {
              const isSearchMatch =
                searchTerm && filteredStations.includes(station);
              const pressureStatus =
                station.pressure !== null
                  ? station.pressure >= 80
                    ? { text: '(충분)', status: 'sufficient' as const }
                    : station.pressure >= 60
                    ? { text: '(여유)', status: 'moderate' as const }
                    : { text: '(부족)', status: 'low' as const }
                  : null;

              return (
                <StationItem
                  key={index}
                  style={{
                    background: isSearchMatch ? '#F0F9FF' : '#f9f9f9',
                    border: isSearchMatch ? '1px solid #00B5D8' : 'none',
                  }}
                >
                  <StationName>{station.name}</StationName>
                  <StationInfo>{station.address}</StationInfo>
                  <StationInfo>연락처: {station.contact}</StationInfo>
                  <StationPrice>
                    판매가격: {station.price.toLocaleString()}원/kg
                  </StationPrice>
                  <StationInfo>
                    충전압력:{' '}
                    {station.pressure !== null ? (
                      <>
                        {`${station.pressure} BAR`}
                        {pressureStatus && (
                          <PressureStatus $status={pressureStatus.status}>
                            {pressureStatus.text}
                          </PressureStatus>
                        )}
                      </>
                    ) : (
                      '정보 없음'
                    )}
                  </StationInfo>
                  <StationInfo>대기차량: {station.waitingCount}대</StationInfo>
                  <StationStatus
                    $isOperating={
                      station.operationStatus === '운영중' &&
                      !station.isCharging
                    }
                    style={{
                      color: station.isCharging
                        ? '#f7a233'
                        : station.operationStatus === '운영중'
                        ? '#00b5d8'
                        : '#f73333',
                    }}
                  >
                    {station.isCharging ? '충전중' : station.operationStatus}
                  </StationStatus>
                </StationItem>
              );
            })}
            {getDisplayStations().length === 0 && (
              <StationItem>
                <StationInfo>등록된 충전소가 없습니다.</StationInfo>
              </StationItem>
            )}
          </StationList>
        </EnvironmentCard>
      </CardContainer>
    </Container>
  );
};

export default PriceSection;

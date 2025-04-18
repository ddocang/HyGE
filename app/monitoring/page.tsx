'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import FacilityInfoCard from './components/FacilityInfoCard';
import FacilityListItem from './components/FacilityListItem';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/main/sections/Footer';

// 더미 데이터
const DUMMY_FACILITY = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/monitoring/facility1.jpg',
};

const DUMMY_LIST = [
  {
    id: 1,
    name: '삼척 교동 수소 스테이션',
    address: '강원특별자치도 삼척시 교동 산 209',
    gasStatus: 'normal' as const,
    fireStatus: 'normal' as const,
    vibrationStatus: 'normal' as const,
    type: '대체연료충전소',
    status: 'open' as const,
    phone: '033-575-5189',
    imageUrl: '/images/monitoring/facility1.jpg',
  },
  {
    id: 2,
    name: '삼척 수소충전소',
    address: '강원특별자치도 삼척시 동해대로 3846',
    gasStatus: 'warning' as const,
    fireStatus: 'normal' as const,
    vibrationStatus: 'normal' as const,
    type: '수소충전소',
    status: 'open' as const,
    phone: '033-570-3391',
    imageUrl: '/images/monitoring/facility2.jpg',
  },
  {
    id: 3,
    name: '원주 수소충전소',
    address: '강원특별자치도 원주시 원문로 1320',
    gasStatus: 'inactive' as const,
    fireStatus: 'inactive' as const,
    vibrationStatus: 'inactive' as const,
    type: '수소충전소',
    status: 'open' as const,
    phone: '033-734-4589',
    imageUrl: '/images/monitoring/facility3.jpg',
  },
  {
    id: 4,
    name: '속초 수소충전소',
    address: '강원특별자치도 속초시 동해대로 4521',
    gasStatus: 'inactive' as const,
    fireStatus: 'inactive' as const,
    vibrationStatus: 'inactive' as const,
    type: '수소충전소',
    status: 'open' as const,
    phone: '033-636-3014',
    imageUrl: '/images/monitoring/facility4.jpg',
  },
  {
    id: 5,
    name: '동해 휴게소 수소충전소',
    address: '강원특별자치도 동해시 동해대로 6170',
    gasStatus: 'inactive' as const,
    fireStatus: 'inactive' as const,
    vibrationStatus: 'inactive' as const,
    type: '수소충전소',
    status: 'open' as const,
    phone: '033-535-4891',
    imageUrl: '/images/monitoring/facility5.jpg',
  },
];

export default function MonitoringPage() {
  const [imageHeight, setImageHeight] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState(DUMMY_LIST[0]);
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);

  useEffect(() => {
    // 이미지의 실제 비율 계산 (1920:357)
    const aspectRatio = 357 / 1920;
    const height = Math.floor(window.innerWidth * aspectRatio);
    setImageHeight(height);

    const handleResize = () => {
      const newHeight = Math.floor(window.innerWidth * aspectRatio);
      setImageHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 초기 시간 설정
    setCurrentTime(formatTime(new Date()));

    // 1초마다 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsAutoCompleteVisible(true);
    if (e.target.value === '') {
      setSelectedFacility(DUMMY_LIST[0]);
      setIsAutoCompleteVisible(false);
    }
  };

  const handleAutoCompleteSelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSearchTerm(facility.name);
    setSelectedFacility(facility);
    setIsAutoCompleteVisible(false);
  };

  const handleSearchBarBlur = () => {
    // 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setIsAutoCompleteVisible(false);
    }, 200);
  };

  const filteredList = DUMMY_LIST.filter((facility) => {
    const searchValue = searchTerm.toLowerCase().replace(/\s+/g, '');
    const facilityName = facility.name.toLowerCase().replace(/\s+/g, '');
    const facilityAddress = facility.address.toLowerCase().replace(/\s+/g, '');

    return (
      facilityName.includes(searchValue) ||
      facilityAddress.includes(searchValue)
    );
  });

  useEffect(() => {
    if (filteredList.length > 0 && !filteredList.includes(selectedFacility)) {
      setSelectedFacility(filteredList[0]);
    }
  }, [searchTerm]);

  const handleFacilitySelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSelectedFacility(facility);
  };

  return (
    <Container>
      <TopBanner style={{ height: imageHeight || '357px' }}>
        <BannerBackground>
          <Image
            src="/images/monitoring/monitoring-bg.jpg"
            alt="수소 생산 시설 전경"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 882px"
            quality={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <DarkOverlay />
        </BannerBackground>
        <GNB>
          <Logo>
            <LogoImageWrapper>
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="32px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImageWrapper>
            <span>HyGE</span>
          </Logo>
          <MainMenu></MainMenu>
          <UserMenu>
            <button>로그인</button>
            <button>회원가입</button>
            <Link href="/">홈</Link>
          </UserMenu>
        </GNB>
        <BannerContent>
          <Title>수소 생산시설 & 충전소 모니터링</Title>
          <Subtitle>실시간 모니터링을 통해 안전을 확보합니다.</Subtitle>
        </BannerContent>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <MapContent>
            <FacilityInfo>
              <FacilityInfoCard {...selectedFacility} />
            </FacilityInfo>
            <MapView>
              <SearchBarWrapper>
                <SearchBar>
                  <input
                    type="text"
                    placeholder="수소충전소 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleSearchBarBlur}
                  />
                  {searchTerm && (
                    <ClearButton
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedFacility(DUMMY_LIST[0]);
                        setIsAutoCompleteVisible(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="#D7D7D7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </ClearButton>
                  )}
                  {isAutoCompleteVisible && filteredList.length > 0 && (
                    <AutoCompleteList>
                      {filteredList.map((facility) => (
                        <AutoCompleteItem
                          key={facility.id}
                          onClick={() => handleAutoCompleteSelect(facility)}
                        >
                          <ItemName>{facility.name}</ItemName>
                          <ItemAddress>{facility.address}</ItemAddress>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  )}
                </SearchBar>
              </SearchBarWrapper>
              <Image
                src={
                  selectedFacility.name === '삼척 수소충전소'
                    ? '/images/monitoring/sc.png'
                    : selectedFacility.name === '원주 수소충전소'
                    ? '/images/monitoring/wj.png'
                    : selectedFacility.name === '속초 수소충전소'
                    ? '/images/monitoring/scc.png'
                    : selectedFacility.name === '동해 휴게소 수소충전소'
                    ? '/images/monitoring/dh.png'
                    : '/images/monitoring/kd.png'
                }
                alt={`${selectedFacility.name} 지도`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 882px"
                quality={100}
                style={{
                  objectFit: 'cover',
                  objectPosition:
                    selectedFacility.name === '삼척 수소충전소'
                      ? 'center center'
                      : selectedFacility.name === '원주 수소충전소'
                      ? 'center center'
                      : selectedFacility.name === '속초 수소충전소'
                      ? 'center center'
                      : selectedFacility.name === '동해 휴게소 수소충전소'
                      ? 'center center'
                      : 'center center',
                  transition: 'all 0.3s ease-in-out',
                }}
                priority
              />
            </MapView>
          </MapContent>
        </MapSection>

        <ListSection>
          <UpdateTime>업데이트: {currentTime}</UpdateTime>
          <ListHeader>
            <HeaderItem>상호</HeaderItem>
            <HeaderItem>주소</HeaderItem>
            <HeaderItem>가스감지기</HeaderItem>
            <HeaderItem>화재감지기</HeaderItem>
            <HeaderItem>진동감지기</HeaderItem>
            <HeaderItem>상세보기</HeaderItem>
          </ListHeader>
          <ListContent>
            {filteredList.map((facility) => (
              <FacilityListItem
                key={facility.id}
                {...facility}
                isSelected={selectedFacility.id === facility.id}
                onClick={() => handleFacilitySelect(facility)}
                onDetailClick={() =>
                  (window.location.href = `/monitoring/detail/${facility.id}`)
                }
              />
            ))}
          </ListContent>
        </ListSection>
      </ContentSection>

      <Footer />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

const TopBanner = styled.div`
  position: relative;
  width: 100%;
  transition: height 0.3s ease;

  @media (max-width: 1024px) {
    height: 450px;
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BannerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
`;

const BannerContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  color: white;
  z-index: 1;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 38px;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 20px;
  text-align: center;
  margin-bottom: 10px;
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SearchBar = styled.div`
  width: 800px;
  position: relative;

  input {
    width: 100%;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 25px;
    padding: 0 50px 0 20px;
    color: #d7d7d7;
    font-size: 16px;
    text-align: center;

    &::placeholder {
      color: #d7d7d7;
      text-align: center;
    }

    &:focus {
      outline: none;
      border-color: #0066ff;
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const MapSection = styled.div`
  margin-bottom: 40px;
`;

const FacilityInfo = styled.div`
  width: 378px;
  height: 630px;
`;

const MapView = styled.div`
  flex: 1;
  height: 630px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const ListSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 17px 30px 30px 30px;
`;

const ListHeader = styled.div`
  display: flex;
  background: #f7f7f7;
  padding: 12px 0;
  border-bottom: 1px solid #c5c5c5;
  border-radius: 8px;
`;

const HeaderItem = styled.div`
  flex: 1;
  text-align: center;
  color: #747474;
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 14px;
`;

const ListContent = styled.div`
  margin-top: 10px;
`;

const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  user-select: none;
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  user-select: none;
  height: 32px;

  span {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 32px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const LogoImageWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const MainMenu = styled.div`
  display: flex;
  gap: clamp(24px, 2.5vw, 48px);
  user-select: none;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  a {
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    text-decoration: none;

    &:hover {
      color: #0066ff;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  gap: clamp(16px, 1.67vw, 32px);
  user-select: none;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }

  button,
  a {
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      color: #0066ff;
    }
  }
`;

const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: right;
  padding: 0 0 12px 0;
`;

const MapContent = styled.div`
  display: flex;
  gap: 20px;
`;

const AutoCompleteList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const AutoCompleteItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;
`;

const ItemAddress = styled.div`
  color: #d7d7d7;
  font-size: 14px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }
`;

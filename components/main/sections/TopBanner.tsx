import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { BiShieldAlt2, BiGasPump, BiLogIn, BiUserPlus } from 'react-icons/bi';

const BannerContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding: 0 16.7vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  user-select: none;
  background-color: black;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }
`;

const BackgroundSlide = styled.div<{ $isActive: boolean; $bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: 0;

  @media (max-width: 768px) {
    background-image: url(${(props) =>
      props.$bgImage.replace('main', 'mobile_bg')});
  }
`;

const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: clamp(20px, 2.08vw, 40px);
  user-select: none;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding-top: 1.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  user-select: none;
  height: 36px;

  img {
    height: 36px;
    width: auto;
    object-fit: contain;
    pointer-events: none;
  }

  span {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    line-height: 36px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
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

  button {
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #0066ff;
    }
  }
`;

const FadeContent = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16.7vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(0);
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 0.8s ease-in-out;
  transition-delay: ${(props) => (props.$isActive ? '0.3s' : '0s')};
  z-index: 0;
  pointer-events: none;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 220px;
  }
`;

const MainTitle = styled.div`
  max-width: clamp(360px, 37.5vw, 720px);
  width: 100%;
  user-select: none;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  white-space: nowrap;

  @media (min-width: 2000px) {
    max-width: 840px;
    gap: 0.3em;
  }

  @media (max-width: 1920px) {
    max-width: 720px;
    gap: 0.2em;
  }

  @media (max-width: 1366px) {
    max-width: 600px;
    gap: 0.15em;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    gap: 0.3em;
    white-space: normal;
  }
`;

const TitleText = styled.h1`
  font-family: 'Pretendard';
  font-weight: 800;
  font-size: clamp(40px, 3vw, 64px);
  color: #ffffff;
  line-height: 1.25;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
  white-space: nowrap;

  @media (min-width: 2000px) {
    font-size: 72px;
    line-height: 1.2;
  }

  @media (max-width: 1920px) {
    font-size: 64px;
    line-height: 1.25;
  }

  @media (max-width: 1366px) {
    font-size: 48px;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    font-size: clamp(28px, 5vw, 32px);
    line-height: 1.4;
    white-space: normal;
    word-break: keep-all;
  }
`;

const Description = styled.p`
  font-family: 'Pretendard';
  font-size: clamp(16px, 1.04vw, 20px);
  color: #ffffff;
  margin-top: clamp(16px, 1.25vw, 24px);
  max-width: clamp(360px, 37.5vw, 720px);
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  user-select: none;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-top: 1rem;
  }
`;

const PageNumber = styled.div`
  position: absolute;
  right: clamp(2rem, 16.7vw, 320px);
  bottom: clamp(60px, 6.25vw, 120px);
  font-family: 'Pretendard';
  font-size: clamp(14px, 0.83vw, 16px);
  color: #ffffff;
  user-select: none;

  @media (max-width: 768px) {
    right: 2rem;
    bottom: 2rem;
  }
`;

const SliderNavigation = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding: 0 4rem;
  pointer-events: none;

  @media (max-width: 768px) {
    padding: 0 1rem;
    top: 65%;
  }
`;

const SliderButton = styled.button<{ $direction: 'prev' | 'next' }>`
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:before {
    content: '';
    width: 12px;
    height: 12px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(${(props) =>
      props.$direction === 'prev' ? '135deg' : '-45deg'});
    margin-${(props) => (props.$direction === 'prev' ? 'left' : 'right')}: 4px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    &:before {
      width: 10px;
      height: 10px;
    }
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
`;

const NavButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 90px;
  padding: 8px 16px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px;
    font-size: 13px;
  }
`;

const TopBanner: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const backgroundImages = [
    '/images/main1.png',
    '/images/main2.png',
    '/images/main3.png',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setCurrentPage((prev) => (prev % totalPages) + 1);
      }, 6000);
    }

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleSlideNavigation = (direction: 'prev' | 'next') => {
    setIsAutoplay(false);
    if (direction === 'prev') {
      setCurrentBgIndex((prev) =>
        prev === 0 ? backgroundImages.length - 1 : prev - 1
      );
      setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
    } else {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      setCurrentPage((prev) => (prev % totalPages) + 1);
    }
  };

  return (
    <BannerContainer>
      {backgroundImages.map((img, idx) => (
        <BackgroundSlide
          key={idx}
          $isActive={idx === currentBgIndex}
          $bgImage={img}
        />
      ))}

      <SliderNavigation>
        <SliderButton
          $direction="prev"
          onClick={() => handleSlideNavigation('prev')}
          aria-label="Previous slide"
        />
        <SliderButton
          $direction="next"
          onClick={() => handleSlideNavigation('next')}
          aria-label="Next slide"
        />
      </SliderNavigation>

      <GNB>
        <Logo>
          <div style={{ position: 'relative', width: '36px', height: '36px' }}>
            <Image
              src="/images/logo.png"
              alt="HyGE Logo"
              fill
              sizes="36px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span>HyGE</span>
        </Logo>
        <NavButtons>
          <StyledLink href="/login">
            <NavigationButton>
              <BiLogIn />
              로그인
            </NavigationButton>
          </StyledLink>
          <StyledLink href="/signup">
            <NavigationButton>
              <BiUserPlus />
              회원가입
            </NavigationButton>
          </StyledLink>
          <StyledLink href="/monitoring">
            <NavigationButton>
              <BiShieldAlt2 />
              안전모니터링
            </NavigationButton>
          </StyledLink>
          <StyledLink href="/hydrogen-station">
            <NavigationButton>
              <BiGasPump />
              수소충전소
            </NavigationButton>
          </StyledLink>
        </NavButtons>
      </GNB>

      <FadeContent $isActive={currentBgIndex === 0}>
        <MainTitle>
          <TitleText>SAFETY AS{'\u00A0'}STANDARD</TitleText>
          <TitleText>EFFICIENCY AS{'\u00A0'}EXTRA</TitleText>
        </MainTitle>
        <Description>
          수소생산시설 안전모니터링 시스템으로 미래 에너지의 안전을 선도하세요.
          위험을 예측하고, 이상을 감지해 빠르게 대응하는 스마트한 솔루션으로
          고객과 직원 모두에게 안심을 드립니다.
        </Description>
      </FadeContent>

      <FadeContent $isActive={currentBgIndex === 1}>
        <MainTitle>
          <TitleText>HYDROGEN{'\u00A0'}STATION</TitleText>
          <TitleText>BOOKING{'\u00A0'}AND</TitleText>
          <TitleText>PAYMENT{'\u00A0'}SYSTEM</TitleText>
        </MainTitle>
        <Description>
          수소충전소 예약 및 결제 시스템으로 더 편리한 충전 서비스를 경험하세요.
          실시간 예약 현황 간편한 결제로 기다림 없는 충전이 가능합니다.
        </Description>
      </FadeContent>

      <FadeContent $isActive={currentBgIndex === 2}>
        <MainTitle>
          <TitleText>INNOVATION AND{'\u00A0'}SAFETY</TitleText>
          <TitleText>IN{'\u00A0'}HARMONY</TitleText>
        </MainTitle>
        <Description>
          혁신적인 기술과 안전한 운영이 조화를 이루는 수소 에너지의 미래를
          만들어갑니다. 지속 가능한 에너지 솔루션으로 더 나은 내일을 향해
          나아갑니다.
        </Description>
      </FadeContent>

      <PageNumber>
        {String(currentPage).padStart(2, '0')}/
        {String(totalPages).padStart(2, '0')}
      </PageNumber>
    </BannerContainer>
  );
};

export default TopBanner;

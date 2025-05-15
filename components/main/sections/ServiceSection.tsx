import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.section`
  width: 100%;
  margin: 0 auto;
  min-height: 50.4vw;
  background-color: #f2f2f2;
  padding: 4.7vw 5.9vw;
  display: flex;
  gap: 1.25vw;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 0;
    gap: 2rem;
  }
`;

const ServiceCard = styled.div`
  flex: 1;
  width: 44vw;
  height: 41vw;
  aspect-ratio: 846/786;
  border-radius: 2.1vw;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: #fafdff;
  border: 1.5px solid #bae6fd;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: 60vh;
  }
`;

const CardImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 100%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${(props) => props.$image}) no-repeat center;
    background-size: cover;
    transition: transform 0.5s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    z-index: 1;
  }

  ${ServiceCard}:hover &::before {
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  z-index: 2;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: #ffffff;
  margin: 0;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
  }
`;

const CardSubtitle = styled.p`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: #ffffff;
  margin: 0;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: clamp(0.875rem, 1.5vw, 1.25rem);
  }
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-family: 'Pretendard';
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 90px;
`;

const ViewMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  justify-content: center;

  span {
    font-family: 'Pretendard';
    font-size: clamp(0.875rem, 1.2vw, 1rem);
    color: #ffffff;
  }

  .circle {
    width: clamp(2rem, 2.5vw, 2.125rem);
    height: clamp(2rem, 2.5vw, 2.125rem);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ServiceSection: React.FC = () => {
  return (
    <Container>
      <Link href="/monitoring" passHref>
        <ServiceCard>
          <CardImage $image="/images/service1.png">
            <CardContent>
              <CardTitle>안전모니터링</CardTitle>
              <CardSubtitle>청정에너지를 안전하게</CardSubtitle>
              <TagContainer>
                <Tag>#수소충전소</Tag>
                <Tag>#수소생산시설</Tag>
                <Tag>#튜브트레일러</Tag>
              </TagContainer>
              <ViewMore>
                <span>View more</span>
                <div className="circle">→</div>
              </ViewMore>
            </CardContent>
          </CardImage>
        </ServiceCard>
      </Link>

      <ServiceCard>
        <CardImage $image="/images/service2.png">
          <CardContent>
            <CardTitle>수소 충전소</CardTitle>
            <CardSubtitle>탄소 없는 내일을 위한 충전 허브</CardSubtitle>
            <TagContainer>
              <Tag>#충전 예약</Tag>
              <Tag>#결제 등록</Tag>
              <Tag>#CCTV 확인</Tag>
            </TagContainer>
            <ViewMore>
              <span>View more</span>
              <div className="circle">→</div>
            </ViewMore>
          </CardContent>
        </CardImage>
      </ServiceCard>
    </Container>
  );
};

export default ServiceSection;

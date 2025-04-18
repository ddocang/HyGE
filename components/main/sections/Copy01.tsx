import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  min-height: clamp(600px, 50.4vw, 968px);
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 clamp(1rem, 16.7vw, 320px);
  user-select: none;

  @media (max-width: 1024px) {
    padding: 4rem 2rem;
    min-height: auto;
  }
`;

const Contents = styled.div`
  max-width: clamp(320px, 55.8vw, 1071px);
  width: 100%;
  user-select: none;
`;

const Title = styled.h2`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: clamp(32px, 4.17vw, 80px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #000000;
  margin: 0;
  margin-bottom: clamp(16px, 1.25vw, 24px);
  text-align: center;
  word-break: keep-all;
  user-select: none;

  span {
    color: #0c6de5;
  }

  br {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    letter-spacing: -0.01em;
  }
`;

const Description = styled.p`
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: clamp(14px, 0.83vw, 16px);
  line-height: 1.5;
  text-align: center;
  color: #767676;
  max-width: clamp(280px, 38.5vw, 740px);
  margin: 0 auto;
  margin-top: clamp(40px, 4.17vw, 80px);
  word-break: keep-all;
  user-select: none;
`;

const Copy01: React.FC = () => {
  return (
    <Container>
      <Contents>
        <Title>
          <span>수소</span>로 여는 지속 가능한 내일
          <br />
          지구를 위한 <span>스마트 에너지</span> 플랫폼
          <br />
          <span>미래</span>로 향하는 길을 밝혀줍니다
        </Title>
        <Description>
          지이는 친환경 수소 에너지 솔루션을 제공하며, 탄소 중립 사회로의 전환을
          선도하는 기업입니다. 혁신적인 기술과 지속 가능한 비전을 통해 깨끗한
          에너지 생태계를 구축합니다.
        </Description>
      </Contents>
    </Container>
  );
};

export default Copy01;

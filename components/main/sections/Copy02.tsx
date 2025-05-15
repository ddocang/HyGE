import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  min-height: clamp(600px, 50.4vw, 968px);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 clamp(1rem, 16.7vw, 320px);
  user-select: none;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
  }

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;

  span {
    color: #0c6de5;
  }

  @media (max-width: 768px) {
    font-size: clamp(24px, 4.17vw, 32px);
    letter-spacing: -0.01em;
    line-height: 1.3;
    gap: 0.3em;
  }
`;

const TitleLine = styled.div`
  width: 100%;
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

const Copy02: React.FC = () => {
  return (
    <Container>
      <Contents>
        <Title>
          <TitleLine>
            수소산업의 <span>새로운 플랫폼</span>
          </TitleLine>
          <TitleLine>
            혁신적인 <span>기술로</span> 미래를 선도하며
          </TitleLine>
          <TitleLine>
            모니터링의 <span>표준을</span> 만들어 갑니다
          </TitleLine>
        </Title>
        <Description>
          지이는 수소 에너지 기술의 혁신을 통해 더 깨끗하고 안전한 미래를
          만들어갑니다. 우리의 기술력과 경험을 바탕으로 수소 에너지 시장을
          선도하며, 지속 가능한 발전을 이끌어 나갑니다.
        </Description>
      </Contents>
    </Container>
  );
};

export default Copy02;

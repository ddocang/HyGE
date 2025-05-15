'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Container = styled.section`
  width: 100%;
  min-height: 500px;
  height: auto;
  padding: clamp(40px, 2.08vw, 40px) clamp(1rem, 8.33vw, 160px);
  background-color: #ffffff;

  @media (max-width: 1366px) {
    padding: 40px 40px;
  }
`;

const Content = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(24px, 1.25vw, 24px);

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const MainTitle = styled.h2`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: clamp(24px, 1.25vw, 24px);
  color: #111111;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ViewMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'Pretendard';
  font-size: clamp(14px, 0.83vw, 16px);
  color: #767676;
  transition: color 0.2s;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  &:hover {
    color: #111111;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 0.83vw, 16px);
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    margin-bottom: 24px;
  }
`;

const NewsCard = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NewsTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: clamp(14px, 0.83vw, 16px);
  line-height: 1.5;
  color: #111111;
  margin: 0;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  flex-grow: 1;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 0.375rem;
  }
`;

const NewsDate = styled.span`
  display: block;
  font-family: 'Pretendard';
  font-size: clamp(12px, 0.73vw, 14px);
  color: #767676;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const NewsSection: React.FC = () => {
  return (
    <Container>
      <Content>
        <TitleSection>
          <MainTitle>지이 소식</MainTitle>
          <ViewMoreButton>
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </ViewMoreButton>
        </TitleSection>

        <NewsGrid>
          <NewsCard
            onClick={() =>
              window.open(
                'http://www.engjournal.co.kr/news/articleView.html?idxno=3220',
                '_blank'
              )
            }
          >
            <ImageWrapper>
              <Image
                src="/images/news/news1.png"
                alt="수소안전플랫폼"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  backgroundColor: '#ffffff',
                }}
                priority
              />
            </ImageWrapper>
            <NewsTitle>
              '수소안전플랫폼' 통해, 실시간 감시·예지보전으로 수소 안전성
              강화한다
            </NewsTitle>
            <NewsDate>2025.04.11</NewsDate>
          </NewsCard>

          <NewsCard
            onClick={() =>
              window.open(
                'https://www.energy-news.co.kr/news/articleView.html?idxno=212859',
                '_blank'
              )
            }
          >
            <ImageWrapper>
              <Image
                src="/images/news/news2.png"
                alt="수소 트레일러 안전 모니터링"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  backgroundColor: '#ffffff',
                }}
                loading="lazy"
              />
            </ImageWrapper>
            <NewsTitle>수소 트레일러, 폭발 대신 '안전'을 싣는다</NewsTitle>
            <NewsDate>2025.04.17</NewsDate>
          </NewsCard>

          <NewsCard
            onClick={() =>
              window.open(
                'http://www.engjournal.co.kr/news/articleView.html?idxno=3224',
                '_blank'
              )
            }
          >
            <ImageWrapper>
              <Image
                src="/images/news/news3.png"
                alt="삼척시 CCUS 전략"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  backgroundColor: '#ffffff',
                }}
                priority
              />
            </ImageWrapper>
            <NewsTitle>
              삼척시, 수소산업 견인할 CCUS 전략 실행 모드 돌입
            </NewsTitle>
            <NewsDate>2025.04.15</NewsDate>
          </NewsCard>

          <NewsCard
            onClick={() =>
              window.open(
                'https://zdnet.co.kr/view/?no=20250314165552',
                '_blank'
              )
            }
          >
            <ImageWrapper>
              <Image
                src="/images/news/news4.png"
                alt="전기안전관리 기본계획"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  backgroundColor: '#ffffff',
                }}
                loading="lazy"
              />
            </ImageWrapper>
            <NewsTitle>
              정부, '전기안전관리 기본계획' 첫 수립…실시간 원격 전기안전
              모니터링 시스템 구축
            </NewsTitle>
            <NewsDate>2025.03.14</NewsDate>
          </NewsCard>
        </NewsGrid>
      </Content>
    </Container>
  );
};

export default NewsSection;

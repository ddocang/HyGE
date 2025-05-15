'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useState, useEffect } from 'react';

interface FacilityListItemProps {
  id: number;
  name: string;
  address: string;
  gasStatus: 'normal' | 'warning' | 'inactive';
  fireStatus: 'normal' | 'warning' | 'inactive';
  vibrationStatus: 'normal' | 'warning' | 'inactive';
  isSelected?: boolean;
  onClick?: () => void;
  onDetailClick?: () => void;
}

const scan = keyframes`
  0% {
    left: -50%;
    opacity: 0;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    left: 150%;
    opacity: 0;
  }
`;

export default function FacilityListItem({
  name,
  address,
  gasStatus,
  fireStatus,
  vibrationStatus,
  isSelected,
  onClick,
  onDetailClick,
}: FacilityListItemProps) {
  const [truncatedName, setTruncatedName] = useState(name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setTruncatedName(mobile ? name.slice(0, 5) : name);
    };

    handleResize(); // 초기 실행
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [name]);

  return (
    <Container isSelected={isSelected} onClick={onClick}>
      <Column>{truncatedName}</Column>
      <Column hideOnMobile>{address}</Column>
      <Column>
        <StatusWrapper $status={gasStatus}>
          <StatusIndicator status={gasStatus} />
          <StatusLabel status={gasStatus}>
            {gasStatus === 'normal'
              ? '정상'
              : gasStatus === 'warning'
              ? '경고'
              : '비활성'}
          </StatusLabel>
        </StatusWrapper>
      </Column>
      <Column>
        <StatusWrapper $status={fireStatus}>
          <StatusIndicator status={fireStatus} />
          <StatusLabel status={fireStatus}>
            {fireStatus === 'normal'
              ? '정상'
              : fireStatus === 'warning'
              ? '경고'
              : '비활성'}
          </StatusLabel>
        </StatusWrapper>
      </Column>
      <Column>
        <StatusWrapper $status={vibrationStatus}>
          <StatusIndicator status={vibrationStatus} />
          <StatusLabel status={vibrationStatus}>
            {vibrationStatus === 'normal'
              ? '정상'
              : vibrationStatus === 'warning'
              ? '경고'
              : '비활성'}
          </StatusLabel>
        </StatusWrapper>
      </Column>
      <Column>
        <DetailButton
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick?.();
          }}
        >
          <span className="detail-text">상세보기</span>
          <span className="detail-icon">→</span>
        </DetailButton>
      </Column>
    </Container>
  );
}

const Container = styled.div<{ isSelected?: boolean }>`
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#F5F5F5' : 'white')};
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Column = styled.div<{ hideOnMobile?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard';
  font-size: 14px;
  color: #111111;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    display: ${(props) => (props.hideOnMobile ? 'none' : 'flex')};
  }
`;

const StatusWrapper = styled.div<{
  $status: 'normal' | 'warning' | 'inactive';
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;
  min-width: 80px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 30%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
    animation: ${scan} 3s ease-in-out infinite;
    pointer-events: none;
    transform: skewX(-20deg);
    opacity: ${({ $status }) => ($status === 'inactive' ? 0 : 1)};
    display: ${({ $status }) => ($status === 'inactive' ? 'none' : 'block')};
  }
`;

const StatusIndicator = styled.div<{
  status: 'normal' | 'warning' | 'inactive';
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  background-color: ${({ status }) => {
    switch (status) {
      case 'normal':
        return '#34C759';
      case 'warning':
        return '#FF3B30';
      case 'inactive':
        return '#999999';
      default:
        return '#999999';
    }
  }};

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    border: 1px solid currentColor;
    transform: translate(-50%, -50%);
  }
`;

const StatusLabel = styled.span<{ status: 'normal' | 'warning' | 'inactive' }>`
  font-size: 12px;
  font-weight: 500;
  flex-grow: 1;
  text-align: center;
  color: ${({ status }) => {
    switch (status) {
      case 'normal':
        return '#34C759';
      case 'warning':
        return '#FF3B30';
      case 'inactive':
        return '#999999';
      default:
        return '#999999';
    }
  }};
  position: relative;
  z-index: 1;
`;

const DetailButton = styled.button`
  padding: 6px 12px;
  background-color: transparent;
  color: #767676;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  font-family: 'Pretendard';
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  .detail-icon {
    font-size: 16px;
    line-height: 1;
    transition: transform 0.2s;
  }

  &:hover {
    background-color: #f2f2f2;
    color: #111111;
    border-color: #111111;

    .detail-icon {
      transform: translateX(3px);
    }
  }

  @media (max-width: 768px) {
    padding: 6px;
    border-radius: 50%;
    aspect-ratio: 1;
    justify-content: center;

    .detail-text {
      display: none;
    }

    .detail-icon {
      margin: 0;
    }
  }
`;

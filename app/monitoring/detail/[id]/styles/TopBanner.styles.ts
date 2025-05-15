import styled from '@emotion/styled';
import { colors } from '@/app/styles/colors';

// 상단 배너 및 GNB 관련 스타일
export const TopBanner = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    height: auto;
    min-height: unset;
    padding: 4px 4px 0 4px;
    justify-content: center;
  }
`;

export const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 20px 32px;
  user-select: none;
  position: relative;
  z-index: 1;
  max-width: 1920px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 0;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;

  span {
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 32px;
    color: ${colors.theme.light.text.primary};
    line-height: 32px;
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }

  html.dark & span {
    color: ${colors.theme.dark.text.primary};
  }

  @media (max-width: 768px) {
    gap: 8px;
    height: auto;
    padding: 8px;

    span {
      font-size: 24px;
      line-height: 1.2;
    }
  }
`;

export const LogoImageWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

export const BannerTitle = styled.div`
  font-family: 'Pretendard';
  font-size: 15px;
  font-weight: 400;
  color: ${colors.theme.light.text.primary};
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(96, 165, 250, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid #bae6fd;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 24px;
  margin-right: auto;
  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #60a5fa;
    border-radius: 50%;
    box-shadow: 0 0 12px #bae6fd;
  }
  html.dark & {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    &:before {
      background: #ffffff;
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
    }
  }
  @media (max-width: 768px) {
    justify-content: center;
    margin: 0 auto;
    padding: 4px 8px;
    font-size: 13px;
    min-width: 0;
    width: 100%;
    border-radius: 6px;
    &:before {
      margin-right: 4px;
    }
  }
`;

export const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: #eaf3fb;

  html.dark & {
    background: #141414;
  }
`;

export const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.03) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  mix-blend-mode: multiply;
`;

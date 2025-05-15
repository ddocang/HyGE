import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GNB,
  Logo,
  LogoImageWrapper,
  BannerTitle,
  MainMenu,
  NavLinkStyle,
  LogButton,
  UpdateTime,
  TopBanner as TopBannerStyled,
  BannerBackground,
  DarkOverlay,
} from '../styles';
import ThemeToggleButton from '@/app/components/ThemeToggleButton';

interface TopBannerProps {
  params: { id: string };
  pathname: string;
  isMobile: boolean;
  lastUpdateTime: string;
  setIsLogOpen: (open: boolean) => void;
  router: any;
}

const TopBanner: React.FC<TopBannerProps> = ({
  params,
  pathname,
  isMobile,
  lastUpdateTime,
  setIsLogOpen,
  router,
}) => {
  return (
    <TopBannerStyled>
      <BannerBackground>
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
          <span>HyGE&nbsp;Safety&nbsp;Monitoring</span>
        </Logo>
        <BannerTitle>튜브 트레일러 모니터링</BannerTitle>
        {!isMobile && (
          <MainMenu>
            <ThemeToggleButton />
            <Link href="/" passHref legacyBehavior>
              <NavLinkStyle active={pathname === '/'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                홈
              </NavLinkStyle>
            </Link>
            <LogButton as="button" onClick={() => setIsLogOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
              경고 로그
            </LogButton>
            <NavLinkStyle
              as="button"
              onClick={() => router.push(`/monitoring/detail/${params.id}`)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              전단계
            </NavLinkStyle>
            <UpdateTime>업데이트: {lastUpdateTime}</UpdateTime>
          </MainMenu>
        )}
      </GNB>
    </TopBannerStyled>
  );
};

export default TopBanner;

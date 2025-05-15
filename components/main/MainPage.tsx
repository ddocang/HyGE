import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
// 개별 아이콘 import
import { BiShieldAlt2, BiGasPump, BiLogIn, BiUserPlus } from 'react-icons/bi';

// Dynamic imports for components that might have client-side only logic
const TopBanner = dynamic(() => import('./sections/TopBanner'), { ssr: true });
const Copy01 = dynamic(() => import('./sections/Copy01'), { ssr: true });
const ServiceSection = dynamic(() => import('./sections/ServiceSection'), {
  ssr: true,
});
const MapSection = dynamic(() => import('./sections/MapSection'), {
  ssr: true,
});
const PriceSection = dynamic(() => import('./sections/PriceSection'), {
  ssr: true,
});
const Copy02 = dynamic(() => import('./sections/Copy02'), { ssr: true });
const NewsSection = dynamic(() => import('./sections/NewsSection'), {
  ssr: true,
});
const Footer = dynamic(() => import('./sections/Footer'), { ssr: true });

const MainContainer = styled.main`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  > section {
    width: 100%;
    max-width: 100vw;
  }

  @media (max-width: 1024px) {
    > section {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`;

const MainPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth > 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <MainContainer>
      <TopBanner />
      <Copy01 />
      <ServiceSection />
      <MapSection />
      <PriceSection />
      <Copy02 />
      {isClient && isDesktop && <NewsSection />}
      <Footer />
    </MainContainer>
  );
};

export default MainPage;

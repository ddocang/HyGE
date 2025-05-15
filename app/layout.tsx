import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import StyledComponentsRegistry from '../lib/registry';
import '@/styles/globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyle from './styles/GlobalStyle';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'HyGE',
  description: 'Hydrogen platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <ThemeProvider>
          <GlobalStyle />
          <main>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </main>
        </ThemeProvider>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`}
          strategy="afterInteractive"
          nonce="NAVER-MAP-SCRIPT"
        />
      </body>
    </html>
  );
}

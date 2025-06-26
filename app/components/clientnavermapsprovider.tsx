'use client';

import { NavermapsProvider } from 'react-naver-maps';

export default function ClientNavermapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavermapsProvider ncpClientId={process.env.NEXT_PUBLIC_NCP_CLIENT_ID!}>
      {children}
    </NavermapsProvider>
  );
}

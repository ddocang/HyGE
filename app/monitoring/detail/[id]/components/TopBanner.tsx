// 상단 배너 컴포넌트
import React, { useState, useEffect } from 'react';
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
  TopBanner as TopBannerStyled,
  BannerBackground,
  DarkOverlay,
} from '../styles';
import ThemeToggleButton from '@/app/components/ThemeToggleButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { UpdateTime } from '../styles/MainMenu.styles';
import { createClient } from '@supabase/supabase-js';
// SheetJS가 설치되어 있다면 아래 import 사용
import * as XLSX from 'xlsx';
import VibrationThresholdModal from '@/components/VibrationThresholdModal';
import { VIBRATION_SENSORS } from '../constants/sensors';
import { getVibrationThreshold } from '@/hooks/useVibrationThresholds';
import { supabase } from '@lib/supabaseClient';

interface TopBannerProps {
  params: { id: string };
  pathname: string;
  isMobile: boolean;
  lastUpdateTime: string;
  setIsLogOpen: (open: boolean) => void;
  router: any;
  onDownloadClick?: () => void;
}

const TopBanner: React.FC<TopBannerProps> = ({
  params,
  pathname,
  isMobile,
  lastUpdateTime,
  setIsLogOpen,
  router,
  onDownloadClick,
}) => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVibrationThresholdModal, setShowVibrationThresholdModal] =
    useState(false);
  const [loginId, setLoginId] = useState<string | null>(null);
  // 진동 임계값 상태
  const [thresholds, setThresholds] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    VIBRATION_SENSORS.forEach((sensor) => {
      initial[sensor.id] = getVibrationThreshold(sensor.id);
    });
    return initial;
  });
  // 임계값 변경 시 localStorage 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'vibrationThresholdInputs',
        JSON.stringify(thresholds)
      );
      setLoginId(localStorage.getItem('loginId'));
    }
  }, [thresholds]);

  // Supabase 클라이언트 생성 (프론트엔드 anon key)
  const supabase = createClient(
    'https://wxsmvftivxerlchikwpl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c212ZnRpdnhlcmxjaGlrd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTQ2MzUsImV4cCI6MjA1Njk5MDYzNX0.uv3ZYHgjppKya4V79xfaSUd0C91ehOj5gnzoWznLw7M'
  );

  // 엑셀 다운로드 기능 (SheetJS가 없으면 CSV로 대체)
  const handleExcelDownload = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);
    try {
      const from = startDate + ' 00:00:00';
      const to = endDate + ' 23:59:59';
      const pad = (n: number) => n.toString().padStart(2, '0');
      const columnOrder = [
        'last_update_time',
        'vibration1',
        'vibration2',
        'vibration3',
        'vibration4',
        'vibration5',
        'vibration6',
        'vibration7',
        'vibration8',
        'vibration9',
      ];
      let offset = 0;
      let allData: any[] = [];
      while (true) {
        const { data, error } = await supabase
          .from('realtime_data')
          .select('*')
          .gte('last_update_time', from)
          .lte('last_update_time', to)
          .eq('topic_id', 'BASE/P001')
          .order('last_update_time', { ascending: true })
          .range(offset, offset + 999);
        if (error) throw error;
        if (!data || data.length === 0) {
          if (offset === 0) setError('다운로드할 데이터가 없습니다.');
          break;
        }
        allData = allData.concat(data);
        if (data.length < 1000) break;
        offset += 1000;
      }
      if (allData.length === 0) return;
      const dataWithKST = allData.map((row) => {
        const newRow = { ...row };
        if (row.last_update_time) {
          const utcDate = new Date(row.last_update_time);
          if (!isNaN(utcDate.getTime())) {
            const kstDate = new Date(
              utcDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
            );
            const yyyy = kstDate.getFullYear();
            const mm = pad(kstDate.getMonth() + 1);
            const dd = pad(kstDate.getDate());
            const HH = pad(kstDate.getHours());
            const min = pad(kstDate.getMinutes());
            const sec = pad(kstDate.getSeconds());
            newRow.last_update_time = `'${yyyy}-${mm}-${dd} ${HH}:${min}:${sec}`;
          }
        }
        delete newRow.id;
        delete newRow.topic_id;
        if (newRow.barr) {
          const arr = String(newRow.barr).split(',');
          for (let i = 0; i < 9; i++) {
            newRow[`vibration${i + 1}`] = arr[i] ?? '';
          }
          delete newRow.barr;
        }
        return newRow;
      });
      // SheetJS로 엑셀 파일 생성
      const ws_data = [
        columnOrder,
        ...dataWithKST.map((row) => columnOrder.map((col) => row[col] ?? '')),
      ];
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      // A열(1열) 서식 지정 (텍스트로 인식)
      const range = XLSX.utils.decode_range(ws['!ref']!);
      for (let R = 1; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })];
        if (cell) cell.z = 'yyyy-mm-dd hh:mm:ss';
      }
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Vibration_data_${startDate}_${endDate}.xlsx`);
    } catch (e: any) {
      setError(e.message || '다운로드 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

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
        <BannerTitle>삼척 교동 수소 스테이션</BannerTitle>
        {!isMobile && (
          <MainMenu>
            <ThemeToggleButton />
            {loginId && (
              <>
                <button
                  style={{
                    margin: '0 6px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#475569',
                    fontFamily: 'Pretendard',
                    fontSize: 15,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setShowVibrationThresholdModal(true)}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#475569')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 20h20L12 2z" fill="#222" opacity="0.18" />
                    <path
                      d="M12 8v4"
                      stroke="#222"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16" r="1.2" fill="#222" />
                    <g>
                      <circle
                        cx="18"
                        cy="6"
                        r="2"
                        fill="#fff"
                        stroke="#222"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M18 4.5v3M16.5 6h3"
                        stroke="#222"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  진동값설정
                </button>
                <NavLinkStyle
                  as="button"
                  onClick={() => setDownloadModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                      stroke="#222"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  다운로드
                </NavLinkStyle>
              </>
            )}
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
            <Link
              href={`/monitoring/detail/${params.id}/tube-trailer`}
              passHref
              legacyBehavior
            >
              <NavLinkStyle active={pathname.includes('tube-trailer')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
                튜브트레일러
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
              onClick={() => router.push('/monitoring')}
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
            <NavLinkStyle
              as="a"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const popupWidth = 1024;
                const popupHeight = 600;
                const left =
                  window.screenX + (window.outerWidth - popupWidth) / 2;
                const top =
                  window.screenY + (window.outerHeight - popupHeight) / 2;
                window.open(
                  '/cctv',
                  'cctvPopup',
                  `width=${popupWidth},height=${popupHeight},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
                );
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                width="20"
                height="20"
              >
                <rect
                  x="2"
                  y="7"
                  width="15"
                  height="10"
                  rx="2"
                  fill="#222"
                  fillOpacity="0.18"
                  stroke="#222"
                  strokeWidth="1.5"
                />
                <circle cx="9.5" cy="12" r="2.5" fill="#222" />
                <rect
                  x="17"
                  y="10"
                  width="4"
                  height="4"
                  rx="1"
                  fill="#222"
                  stroke="#222"
                  strokeWidth="1.2"
                />
              </svg>
              CCTV
            </NavLinkStyle>
          </MainMenu>
        )}
      </GNB>
      {/* 다운로드 팝업 모달 */}
      {downloadModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,40,60,0.32)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Pretendard',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #fafdff 60%, #e0e7ef 100%)',
              borderRadius: 24,
              padding: '40px 32px 32px 32px',
              boxShadow:
                '0 8px 32px 0 rgba(37,99,235,0.13), 0 1.5px 8px 0 rgba(0,0,0,0.08)',
              minWidth: 340,
              maxWidth: 420,
              width: '90vw',
              textAlign: 'center',
              position: 'relative',
              fontFamily: 'Pretendard',
              border: '1.5px solid #e0e7ef',
              transition: 'all 0.2s',
              overflow: 'visible',
            }}
          >
            {/* 닫기(X) 버튼 */}
            <button
              onClick={() => setDownloadModalOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#64748b',
                cursor: 'pointer',
                fontFamily: 'Pretendard',
                padding: 0,
                zIndex: 2,
                transition: 'color 0.2s',
              }}
              aria-label="닫기"
            >
              ×
            </button>
            {/* 타이틀 */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: '-0.5px',
                color: '#222',
                fontFamily: 'Pretendard',
              }}
            >
              진동데이터 다운로드
            </div>
            {/* 설명 */}
            <div
              style={{
                fontSize: 15,
                color: '#64748b',
                marginBottom: 22,
                fontFamily: 'Pretendard',
                fontWeight: 500,
              }}
            ></div>
            {/* 입력 영역 */}
            <div
              style={{
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  fontSize: 16,
                  padding: '10px 16px',
                  border: '1.5px solid #2563eb',
                  borderRadius: 8,
                  fontFamily: 'Pretendard',
                  background: '#f8fafc',
                  color: '#222',
                  outline: 'none',
                  boxShadow: '0 1.5px 8px 0 rgba(37,99,235,0.04)',
                  transition: 'border 0.2s',
                  minWidth: 120,
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  color: '#2563eb',
                  fontFamily: 'Pretendard',
                  fontSize: 18,
                }}
              >
                ~
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  fontSize: 16,
                  padding: '10px 16px',
                  border: '1.5px solid #2563eb',
                  borderRadius: 8,
                  fontFamily: 'Pretendard',
                  background: '#f8fafc',
                  color: '#222',
                  outline: 'none',
                  boxShadow: '0 1.5px 8px 0 rgba(37,99,235,0.04)',
                  transition: 'border 0.2s',
                  minWidth: 120,
                }}
              />
            </div>
            {/* 다운로드 버튼 */}
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 17,
                border: 'none',
                borderRadius: 10,
                padding: '14px 0',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Pretendard',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
                transition: 'background 0.2s',
                opacity: !startDate || !endDate || loading ? 0.6 : 1,
                marginBottom: 6,
                marginTop: 2,
                letterSpacing: '-0.5px',
              }}
              onClick={handleExcelDownload}
              disabled={!startDate || !endDate || loading}
            >
              {loading ? '다운로드 중...' : '엑셀 다운로드'}
            </button>
            {error && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: 15,
                  marginTop: 10,
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 진동값설정 팝업 */}
      <VibrationThresholdModal
        open={showVibrationThresholdModal}
        onClose={() => setShowVibrationThresholdModal(false)}
        thresholds={thresholds}
        setThresholds={setThresholds}
        sensors={VIBRATION_SENSORS.map(({ id, name }) => ({ id, name }))}
      />
    </TopBannerStyled>
  );
};

export default TopBanner;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '@/app/styles/colors';
import { tubeTrailerMockData, getStatusType } from './tubeTrailerMockData';
import { Plus } from 'lucide-react';
import {
  PopupOverlay,
  DetailedGraphPopup,
  PopupHeader,
  CloseButton,
  PopupButton,
  RegisterPopup,
} from '../styles';

// 새로운 튜브트레일러의 기본 좌표 (서울시청)
const DEFAULT_LOCATION = {
  lat: 37.566667,
  lng: 126.978333,
};

interface TubeTrailer {
  id: string;
  carNo: string;
  coupling: string;
  landingGearL: string;
  landingGearR: string;
  tBrake: string;
  gasSensor: string;
  lat: number;
  lng: number;
  backgroundColor: string;
}

interface TubeTrailerListProps {
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
}

const TubeTrailerList: React.FC<TubeTrailerListProps> = ({
  selectedVehicleId,
  onVehicleSelect,
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [carNo, setCarNo] = useState('');
  const [tubeList, setTubeList] = useState<TubeTrailer[]>([
    ...tubeTrailerMockData,
  ]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // 반응형 디자인을 위한 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // 팝업 열기(추가 모드)
  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setCarNo('');
    setEditId(null);
  };

  // 팝업 닫기
  const handleClose = () => {
    setIsRegisterOpen(false);
    setCarNo('');
    setEditId(null);
  };

  // 저장(추가/수정)
  const handleSave = () => {
    if (carNo.trim() === '') return;
    if (editId !== null) {
      // 수정 모드
      setTubeList(tubeList.map((t) => (t.id === editId ? { ...t, carNo } : t)));
    } else {
      // 추가 모드
      const newId =
        tubeList.length > 0
          ? Math.max(...tubeList.map((t) => Number(t.id))) + 1
          : 1;
      setTubeList([
        ...tubeList,
        {
          id: newId.toString(),
          carNo,
          coupling: '정상',
          landingGearL: '정상',
          landingGearR: '정상',
          tBrake: '정상',
          gasSensor: '정상',
          ...DEFAULT_LOCATION,
          backgroundColor: '#fff',
        },
      ]);
    }
    setCarNo('');
    setEditId(null);
    setIsRegisterOpen(false);
  };

  // 삭제
  const handleDelete = (id: string) => {
    setTubeList(tubeList.filter((t) => t.id !== id));
    // 만약 수정 중이던 항목을 삭제하면 입력창 초기화
    if (editId === id) {
      setCarNo('');
      setEditId(null);
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (id: string) => {
    const target = tubeList.find((t) => t.id === id);
    if (target) {
      setCarNo(target.carNo);
      setEditId(id);
      setIsRegisterOpen(true);
    }
  };

  return (
    <>
      <ListCard>
        <ListHeaderWrapper>
          <ListHeader>튜브트레일러 목록</ListHeader>
          <RegisterButton onClick={handleRegisterClick}>
            <Plus
              size={16}
              style={{ marginRight: 6, verticalAlign: 'middle' }}
            />
            등록/수정
          </RegisterButton>
        </ListHeaderWrapper>
        <TubeList>
          <TubeListHeader $isMobile={isMobile} $isTablet={isTablet}>
            <div>No.</div>
            <div>차량번호</div>
            {!isMobile && <div>커플링</div>}
            {!isMobile && !isTablet && <div>랜딩기어(L)</div>}
            {!isMobile && !isTablet && <div>랜딩기어(R)</div>}
            {!isMobile && <div>P/Brake</div>}
            {!isMobile && <div>가스감지기</div>}
            <div>위치</div>
          </TubeListHeader>
          <TubeListBody>
            {tubeList.map((tube, idx) => (
              <TubeListItem
                key={tube.id}
                onClick={() => onVehicleSelect(tube.id)}
                $isSelected={selectedVehicleId === tube.id}
                $isMobile={isMobile}
                $isTablet={isTablet}
              >
                <div>{idx + 1}</div>
                <div>
                  <CarNumberCell $backgroundColor={tube.backgroundColor}>
                    {tube.carNo}
                  </CarNumberCell>
                </div>
                {!isMobile && (
                  <StatusWrapper $status={getStatusType(tube.coupling)}>
                    <StatusIndicator $status={getStatusType(tube.coupling)} />
                    <StatusLabel $status={getStatusType(tube.coupling)}>
                      {tube.coupling}
                    </StatusLabel>
                  </StatusWrapper>
                )}
                {!isMobile && !isTablet && (
                  <StatusWrapper $status={getStatusType(tube.landingGearL)}>
                    <StatusIndicator
                      $status={getStatusType(tube.landingGearL)}
                    />
                    <StatusLabel $status={getStatusType(tube.landingGearL)}>
                      {tube.landingGearL}
                    </StatusLabel>
                  </StatusWrapper>
                )}
                {!isMobile && !isTablet && (
                  <StatusWrapper $status={getStatusType(tube.landingGearR)}>
                    <StatusIndicator
                      $status={getStatusType(tube.landingGearR)}
                    />
                    <StatusLabel $status={getStatusType(tube.landingGearR)}>
                      {tube.landingGearR}
                    </StatusLabel>
                  </StatusWrapper>
                )}
                {!isMobile && (
                  <StatusWrapper $status={getStatusType(tube.tBrake)}>
                    <StatusIndicator $status={getStatusType(tube.tBrake)} />
                    <StatusLabel $status={getStatusType(tube.tBrake)}>
                      {tube.tBrake}
                    </StatusLabel>
                  </StatusWrapper>
                )}
                {!isMobile && (
                  <StatusWrapper $status={getStatusType(tube.gasSensor)}>
                    <StatusIndicator $status={getStatusType(tube.gasSensor)} />
                    <StatusLabel $status={getStatusType(tube.gasSensor)}>
                      {tube.gasSensor}
                    </StatusLabel>
                  </StatusWrapper>
                )}
                <div
                  style={{
                    fontSize: isMobile
                      ? '0.8em'
                      : isTablet
                      ? '0.85em'
                      : '0.85em',
                    color: '#64748b',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    위도:{' '}
                    {isMobile
                      ? Number(tube.lat).toFixed(3)
                      : isTablet
                      ? Number(tube.lat).toFixed(4)
                      : tube.lat.toFixed(5)}
                  </div>
                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    경도:{' '}
                    {isMobile
                      ? Number(tube.lng).toFixed(3)
                      : isTablet
                      ? Number(tube.lng).toFixed(4)
                      : tube.lng.toFixed(5)}
                  </div>
                </div>
              </TubeListItem>
            ))}
          </TubeListBody>
        </TubeList>
      </ListCard>

      {/* 팝업(모달) */}
      <PopupOverlay isOpen={isRegisterOpen} onClick={handleClose} />
      <RegisterPopup isOpen={isRegisterOpen}>
        <PopupHeader>
          <h2>튜브트레일러 등록/수정</h2>
          <div className="button-group">
            <CloseButton onClick={handleClose}>×</CloseButton>
          </div>
        </PopupHeader>
        <ResponsivePopupContent $isMobile={isMobile}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              현재 등록된 차량번호 목록
            </div>
            <ResponsiveTable $isMobile={isMobile}>
              <thead>
                <tr style={{ background: '#e5e7eb' }}>
                  <th>NO.</th>
                  <th>차량번호</th>
                  <th>ID</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {tubeList.map((tube, idx) => (
                  <tr key={tube.id}>
                    <td>{idx + 1}</td>
                    <td>{tube.carNo}</td>
                    <td>{tube.id}</td>
                    <td>
                      <ActionButton
                        data-type="edit"
                        onClick={() => handleEdit(tube.id)}
                      >
                        수정
                      </ActionButton>
                    </td>
                    <td>
                      <ActionButton
                        data-type="delete"
                        onClick={() => handleDelete(tube.id)}
                      >
                        삭제
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ResponsiveTable>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '8px' : '12px',
              marginBottom: '24px',
            }}
          >
            <div style={{ width: isMobile ? 'auto' : '80px', flexShrink: 0 }}>
              차량번호:
            </div>
            <input
              value={carNo}
              onChange={(e) => setCarNo(e.target.value)}
              style={{
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? 'none' : 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
              }}
            />
          </div>
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              gap: 12,
              justifyContent: isMobile ? 'space-between' : 'flex-start',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <PopupButton
              onClick={handleSave}
              style={{ flex: isMobile ? '1' : 'none' }}
            >
              {editId !== null ? '수정' : '저장'}
            </PopupButton>
            <PopupButton
              onClick={handleClose}
              style={{ flex: isMobile ? '1' : 'none' }}
            >
              취소
            </PopupButton>
          </div>
        </ResponsivePopupContent>
      </RegisterPopup>
    </>
  );
};

const ListCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px 0 0 0;
  margin: 0px 0 0px 0px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  border: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
`;
const ListHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 16px 15px;
  font-family: 'Pretendard', sans-serif;
`;
const ListHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
`;
const RegisterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 4.5px 11px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  margin-top: -11px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #1746a2 0%, #2563eb 100%);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
    transform: translateY(-2px) scale(1.03);
  }
  svg {
    display: inline-block;
    vertical-align: middle;
  }
`;
const TubeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding: 0 8px;
  font-family: 'Pretendard', sans-serif;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 0 4px;
  }
`;
const TubeListHeader = styled.div<{ $isMobile?: boolean; $isTablet?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isMobile
      ? '0.5fr 1.5fr 2fr'
      : props.$isTablet
      ? 'repeat(5, 1fr)'
      : 'repeat(8, 1fr)'};
  column-gap: ${(props) =>
    props.$isMobile ? '5px' : props.$isTablet ? '8px' : '12px'};
  font-size: ${(props) => (props.$isMobile ? '11px' : '13px')};
  font-weight: 500;
  color: #64748b;
  background: #f3f6fa;
  padding: ${(props) => (props.$isMobile ? '8px 10px' : '10px 15px')};
  border-bottom: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
  overflow-x: hidden;

  & > div {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    min-width: ${(props) => (props.$isMobile ? '30px' : '40px')};

    & > div {
      display: inline-flex;
    }
  }

  @media (min-width: 769px) and (max-width: 1366px) {
    column-gap: 5px;
    padding: 10px 10px;
    font-size: 12px;
    & > div {
      min-width: 30px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    column-gap: 3px;
    padding: 8px 8px;
    font-size: 11px;
    & > div {
      min-width: 25px;
    }
  }
`;
const TubeListBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  font-family: 'Pretendard', sans-serif;
`;
const CarNumberCell = styled.div<{ $backgroundColor: string }>`
  background-color: ${(props) => props.$backgroundColor};
  padding: 4px 8px;
  border-radius: 4px;
  color: #000000;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 3px 6px;
    min-width: 35px;
    font-size: 0.9em;
  }

  @media (min-width: 769px) and (max-width: 1366px) {
    padding: 3px 6px;
    min-width: 40px;
    font-size: 0.85em;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 2px 4px;
    min-width: 35px;
    font-size: 0.8em;
  }
`;
const TubeListItem = styled.div<{
  $isSelected?: boolean;
  $isMobile?: boolean;
  $isTablet?: boolean;
}>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isMobile
      ? '0.5fr 1.5fr 2fr'
      : props.$isTablet
      ? 'repeat(5, 1fr)'
      : 'repeat(8, 1fr)'};
  column-gap: ${(props) =>
    props.$isMobile ? '5px' : props.$isTablet ? '8px' : '12px'};
  align-items: center;
  font-size: ${(props) => (props.$isMobile ? '11px' : '13px')};
  color: #222;
  padding: ${(props) => (props.$isMobile ? '8px 10px' : '10px 15px')};
  border-bottom: 1px solid ${colors.theme.light.border};
  background: ${(props) => (props.$isSelected ? '#f3f6fa' : '#fff')};
  transition: background 0.15s;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  overflow-x: hidden;

  &:hover {
    background: #f3f6fa;
  }

  &:last-child {
    border-bottom: none;
  }

  & > div {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    min-width: ${(props) => (props.$isMobile ? '30px' : '40px')};

    & > div {
      display: inline-flex;
    }
  }

  @media (min-width: 769px) and (max-width: 1366px) {
    column-gap: 5px;
    padding: 10px 10px;
    font-size: 12px;
    & > div {
      min-width: 30px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    column-gap: 3px;
    padding: 8px 8px;
    font-size: 11px;
    & > div {
      min-width: 25px;
    }
  }
`;
const StatusWrapper = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 3px 5px;
  border-radius: 20px;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;

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
    animation: scan 3s ease-in-out infinite;
    pointer-events: none;
    transform: skewX(-20deg);
    opacity: ${({ $status }) => ($status === 'inactive' ? 0 : 1)};
    display: ${({ $status }) => ($status === 'inactive' ? 'none' : 'block')};
  }

  @keyframes scan {
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
  }

  @media (min-width: 769px) and (max-width: 1366px) {
    gap: 5px;
    padding: 2px 4px;
    font-size: 0.8em;
    border-radius: 15px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 3px;
    padding: 2px 3px;
    font-size: 0.75em;
    border-radius: 12px;
  }
`;

const StatusIndicator = styled.div<{ $status: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  background-color: ${({ $status }) => {
    switch ($status) {
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

  @media (min-width: 769px) and (max-width: 1366px) {
    width: 6px;
    height: 6px;
  }

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
`;

const StatusLabel = styled.span<{ $status: string }>`
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: ${({ $status }) => {
    switch ($status) {
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

  @media (min-width: 769px) and (max-width: 1366px) {
    font-size: 11px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 10px;
  }
`;

// 팝업 내용 반응형 컨테이너
const ResponsivePopupContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${(props) => (props.$isMobile ? '16px' : '32px')};
  max-height: ${(props) => (props.$isMobile ? 'calc(100vh - 120px)' : 'auto')};
  overflow-y: auto;
`;

// 반응형 테이블
const ResponsiveTable = styled.table<{ $isMobile?: boolean }>`
  width: 100%;
  border-collapse: collapse;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  font-size: ${(props) => (props.$isMobile ? '13px' : '14px')};

  th,
  td {
    padding: ${(props) => (props.$isMobile ? '6px 4px' : '8px')};
    border: 1px solid #e5e7eb;
    text-align: center;
  }

  th {
    font-weight: 600;
    color: #4b5563;
  }

  @media (max-width: 480px) {
    display: ${(props) => (props.$isMobile ? 'block' : 'table')};
    max-width: 100%;
    overflow-x: hidden;
  }
`;

// 액션 버튼 (수정, 삭제)
const ActionButton = styled.button`
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  font-size: inherit;
  white-space: nowrap;

  &[data-type='edit'] {
    border-color: #60a5fa;
    background: #e0f2fe;
    color: #2563eb;
  }

  &[data-type='delete'] {
    border-color: #fca5a5;
    background: #fee2e2;
    color: #ef4444;
  }

  @media (max-width: 768px) {
    padding: 3px 6px;
    font-size: 12px;
  }
`;

console.log('TubeTrailerMap:', TubeTrailerList);

export default TubeTrailerList;

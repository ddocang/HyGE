import React, { useState } from 'react';
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
          <TubeListHeader>
            <div>No.</div>
            <div>차량번호</div>
            <div>커플링</div>
            <div>랜딩기어(L)</div>
            <div>랜딩기어(R)</div>
            <div>P/Brake</div>
            <div>가스감지기</div>
            <div>위치</div>
          </TubeListHeader>
          <TubeListBody>
            {tubeList.map((tube, idx) => (
              <TubeListItem
                key={tube.id}
                onClick={() => onVehicleSelect(tube.id)}
                isSelected={selectedVehicleId === tube.id}
              >
                <div>{idx + 1}</div>
                <div>
                  <CarNumberCell backgroundColor={tube.backgroundColor}>
                    {tube.carNo}
                  </CarNumberCell>
                </div>
                <StatusWrapper $status={getStatusType(tube.coupling)}>
                  <StatusIndicator $status={getStatusType(tube.coupling)} />
                  <StatusLabel $status={getStatusType(tube.coupling)}>
                    {tube.coupling}
                  </StatusLabel>
                </StatusWrapper>
                <StatusWrapper $status={getStatusType(tube.landingGearL)}>
                  <StatusIndicator $status={getStatusType(tube.landingGearL)} />
                  <StatusLabel $status={getStatusType(tube.landingGearL)}>
                    {tube.landingGearL}
                  </StatusLabel>
                </StatusWrapper>
                <StatusWrapper $status={getStatusType(tube.landingGearR)}>
                  <StatusIndicator $status={getStatusType(tube.landingGearR)} />
                  <StatusLabel $status={getStatusType(tube.landingGearR)}>
                    {tube.landingGearR}
                  </StatusLabel>
                </StatusWrapper>
                <StatusWrapper $status={getStatusType(tube.tBrake)}>
                  <StatusIndicator $status={getStatusType(tube.tBrake)} />
                  <StatusLabel $status={getStatusType(tube.tBrake)}>
                    {tube.tBrake}
                  </StatusLabel>
                </StatusWrapper>
                <StatusWrapper $status={getStatusType(tube.gasSensor)}>
                  <StatusIndicator $status={getStatusType(tube.gasSensor)} />
                  <StatusLabel $status={getStatusType(tube.gasSensor)}>
                    {tube.gasSensor}
                  </StatusLabel>
                </StatusWrapper>
                <div style={{ fontSize: '0.9em', color: '#64748b' }}>
                  {tube.lat.toFixed(6)}, {tube.lng.toFixed(6)}
                </div>
              </TubeListItem>
            ))}
          </TubeListBody>
        </TubeList>
      </ListCard>

      {/* 팝업(모달) */}
      <PopupOverlay isOpen={isRegisterOpen} onClick={handleClose} />
      <DetailedGraphPopup isOpen={isRegisterOpen}>
        <PopupHeader>
          <h2>튜브트레일러 등록/수정</h2>
          <div className="button-group">
            <CloseButton onClick={handleClose}>×</CloseButton>
          </div>
        </PopupHeader>
        <div style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              현재 등록된 차량번호 목록
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#f9fafb',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ background: '#e5e7eb' }}>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                    NO.
                  </th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                    차량번호
                  </th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                    ID
                  </th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                    수정
                  </th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody>
                {tubeList.map((tube, idx) => (
                  <tr key={tube.id}>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      {tube.carNo}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      {tube.id}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid #60a5fa',
                          background: '#e0f2fe',
                          color: '#2563eb',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleEdit(tube.id)}
                      >
                        수정
                      </button>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid #fca5a5',
                          background: '#fee2e2',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleDelete(tube.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label>
            차량번호:
            <input value={carNo} onChange={(e) => setCarNo(e.target.value)} />
          </label>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <PopupButton onClick={handleSave}>
              {editId !== null ? '수정' : '저장'}
            </PopupButton>
            <PopupButton onClick={handleClose}>취소</PopupButton>
          </div>
        </div>
      </DetailedGraphPopup>
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
`;
const TubeListHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 30px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  background: #f3f6fa;
  padding: 14px 24px;
  border-bottom: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
  & > div {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: inline-flex;
    }
  }
`;
const TubeListBody = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  font-family: 'Pretendard', sans-serif;
`;
const CarNumberCell = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  padding: 6px 12px;
  border-radius: 4px;
  color: #000000;
  font-weight: 500;
`;
const TubeListItem = styled.div<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 30px;
  align-items: center;
  font-size: 14px;
  color: #222;
  padding: 14px 24px;
  border-bottom: 1px solid ${colors.theme.light.border};
  background: ${(props) => (props.isSelected ? '#f3f6fa' : '#fff')};
  transition: background 0.15s;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;

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
    & > div {
      display: inline-flex;
    }
  }
`;
const StatusWrapper = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 4px 6px;
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
`;

const StatusIndicator = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
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
`;

const StatusLabel = styled.span<{ $status: string }>`
  font-size: 14px;
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
`;

console.log('TubeTrailerMap:', TubeTrailerList);

export default TubeTrailerList;

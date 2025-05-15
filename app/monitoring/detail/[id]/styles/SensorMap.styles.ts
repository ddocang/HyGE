import styled from '@emotion/styled';
import { colors } from '@/app/styles/colors';

// 센서 지도 및 관련 스타일
export const SensorMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #f3f6fa;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;

  html.dark & {
    background: #23272f;
  }
`;

export const SensorMarker = styled.div<{ selected?: boolean }>`
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ selected }) => (selected ? colors.primary.main : '#fff')};
  border: 2px solid
    ${({ selected }) => (selected ? colors.primary.main : '#d1d5db')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;

  &:hover {
    border: 2px solid #2563eb;
  }

  html.dark & {
    background: ${({ selected }) =>
      selected ? colors.primary.main : '#23272f'};
    border: 2px solid
      ${({ selected }) => (selected ? colors.primary.main : '#444')};
  }
`;

export const SensorTooltip = styled.div`
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translateX(-50%);
  background: #fff;
  color: #222;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;

  html.dark & {
    background: #23272f;
    color: #fff;
  }
`;

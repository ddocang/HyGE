import styled from '@emotion/styled';
import { colors } from '@/app/styles/colors';

export const CustomTooltip = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1.5px solid #bae6fd;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  backdrop-filter: blur(8px);

  .time {
    font-family: 'Pretendard';
    font-size: 13px;
    color: #2563eb;
    margin-bottom: 4px;
  }

  .value {
    font-family: 'Pretendard';
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  }

  html.dark & {
    background: rgba(17, 25, 40, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    .time {
      color: rgba(255, 255, 255, 0.7);
    }
    .value {
      color: #ffffff;
    }
  }
`;

export const DetailedGraphPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fafdff;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  width: 90vw;
  height: 90vh;
  max-width: 1800px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  border: 1.5px solid #bae6fd;
  backdrop-filter: blur(16px);
  color: #1e293b;
  padding: 0;

  html.dark & {
    background: ${colors.theme.dark.surface};
    border: 1px solid ${colors.theme.dark.border};
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    color: ${colors.theme.dark.text.primary};
  }

  @media (max-width: 768px) {
    width: 98vw;
    height: 90vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 10px;
  }
`;

export const PopupOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 32px 8px 32px;
  background: transparent;
  border-bottom: none;
  gap: 12px;
  position: relative;

  h2 {
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 22px;
    color: #2563eb;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
    text-align: center;
    width: 100%;
    justify-content: center;
  }

  .button-group {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    align-items: center;
    position: absolute;
    right: 32px;
    top: 18px;
  }

  html.dark & h2 {
    color: #60a5fa;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 8px 4px 8px;
    h2 {
      font-size: 16px;
      padding: 0;
      margin-bottom: 8px;
    }
    .button-group {
      position: static;
      flex-direction: row;
      justify-content: center;
      margin-top: 4px;
      margin-bottom: 0;
      gap: 8px;
    }
  }
`;

export const PopupButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#e0e7ef' : '#f8fafc')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#1e293b')};
  border: 1.5px solid ${({ $active }) => ($active ? '#60a5fa' : '#cbd5e1')};
  padding: 10px 20px;
  border-radius: 12px;
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #bae6fd;
    color: #2563eb;
    border-color: #60a5fa;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  html.dark & {
    background: ${({ $active }) =>
      $active ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${({ $active }) =>
      $active ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)'};
    border: 1px solid
      ${({ $active }) =>
        $active ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    &:hover {
      background: ${({ $active }) =>
        $active ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
      color: ${({ $active }) => ($active ? '#93c5fd' : '#ffffff')};
      border-color: ${({ $active }) =>
        $active ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
    }
  }
`;

export const CloseButton = styled(PopupButton)`
  && {
    padding: 10px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: #f8fafc;
    color: #1e293b;
    border: 1.5px solid #cbd5e1;

    &:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fca5a5;
    }
  }
  html.dark & {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.2);
    }
  }
`;

export const DetailedGraphContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 32px 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  position: relative;
  color: #1e293b;
  min-height: 0;
  min-width: 0;
  overflow: hidden;

  .recharts-wrapper {
    width: 100% !important;
    height: 100% !important;
  }

  .recharts-cartesian-axis-line {
    stroke: #64748b !important;
  }

  .recharts-cartesian-axis-tick-value,
  .recharts-label,
  .recharts-text {
    fill: #334155 !important;
    color: #334155 !important;
    font-weight: 600;
  }

  html.dark & {
    color: #f8fafc;
    .recharts-cartesian-axis-line {
      stroke: ${colors.theme.dark.border} !important;
    }
    .recharts-cartesian-axis-tick-value,
    .recharts-label,
    .recharts-text {
      fill: #cbd5e1 !important;
      color: #cbd5e1 !important;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    padding: 0 4px 0 4px;
    min-height: 220px;
    height: 220px;
  }
`;

export const GraphStatsBar = styled.div`
  width: 100%;
  padding: 10px 32px 18px 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  font-size: 15px;
  color: #334155;
  background: none;
  border: none;
  justify-content: center;
  text-align: center;

  .stat {
    font-weight: 600;
    color: #2563eb;
    margin-right: 12px;
  }
  .legend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 4px;
    }
    .dot.normal {
      background: #04a777;
    }
    .dot.warning {
      background: #ffd600;
    }
    .dot.danger {
      background: #d90429;
    }
  }

  html.dark & {
    color: #cbd5e1;
    .stat {
      color: #60a5fa;
    }
    .legend {
      color: #cbd5e1;
    }
  }
`;

export const MainMenu = styled.div`
  display: flex;
  gap: 16px;
  user-select: none;
  align-items: center;
  background: #eaf3fb;
  border: none;
  border-radius: 0;
  box-shadow: none;

  html.dark & {
    background: ${colors.theme.dark.surface};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLinkStyle = styled.a<{ active?: boolean }>`
  && {
    font-family: 'Pretendard';
    font-size: 15px;
    font-weight: 400;
    color: ${({ active }) =>
      active
        ? colors.theme.light.text.primary
        : colors.theme.light.text.secondary};
    text-decoration: none;
    position: relative;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    background: ${({ active }) =>
      active ? 'rgba(96, 165, 250, 0.18)' : 'transparent'};
    border: 1px solid ${colors.theme.light.border};
    backdrop-filter: blur(8px);

    &:hover {
      color: #2563eb;
      border-color: #2563eb;
      background: rgba(96, 165, 250, 0.28);
      svg {
        color: #2563eb;
      }
    }

    svg {
      width: 18px;
      height: 18px;
      transition: all 0.2s ease;
      color: ${({ active }) =>
        active
          ? colors.theme.light.text.primary
          : colors.theme.light.text.secondary};
    }

    html.dark & {
      color: ${({ active }) =>
        active
          ? colors.theme.dark.text.primary
          : colors.theme.dark.text.secondary};
      background: ${({ active }) =>
        active ? colors.theme.dark.surface : 'transparent'};
      border: 1px solid ${colors.theme.dark.border};
      &:hover {
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        svg {
          color: #ffffff;
        }
      }
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${colors.theme.light.surface};
  border: 1px solid ${colors.theme.light.border};
  padding: 4px 8px;
  border-radius: 8px;
  font-family: 'Pretendard';
  font-size: 15px;
  font-weight: 400;
  color: ${colors.theme.light.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;

    svg {
      color: #ffffff;
    }
  }

  svg {
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
  }

  html.dark & {
    background: ${colors.theme.dark.surface};
    border: 1px solid ${colors.theme.dark.border};
    color: ${colors.theme.dark.text.primary};
  }
`;

export const SensorHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr) 80px;
  gap: 8px;
  padding: 12px 16px;
  background: ${colors.theme.light.surface};
  border: 1px solid ${colors.theme.light.border};
  border-radius: 12px;
  margin-bottom: 12px;
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.theme.light.text.primary};
  font-weight: 600;
  box-shadow: inset 0 0 20px rgba(29, 56, 120, 0.05);
  backdrop-filter: blur(8px);
  align-items: center;

  html.dark & {
    background: ${colors.theme.dark.surface};
    border: 1px solid ${colors.theme.dark.border};
    color: ${colors.theme.dark.text.primary};
    box-shadow: inset 0 0 20px rgba(29, 56, 120, 0.15);
  }

  span {
    text-align: center;
    padding: 0 8px;
  }

  span:nth-of-type(5) {
    text-align: center !important;
  }

  > * {
    text-align: center;
  }

  > *:last-child {
    text-align: right;
    padding-right: 0;
  }

  @media (max-width: 1600px) {
    font-size: 12px;
    gap: 6px;
    padding: 10px 12px;
    grid-template-columns: 100px repeat(4, 1fr) 70px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 100px repeat(2, 1fr);
    padding: 8px 10px;
    font-size: 11px;
    gap: 4px;

    > *:nth-of-type(5),
    > *:last-child {
      display: none;
    }
  }
`;

export const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  text-align: right;
`;

export const FilterButton = styled.button<{ isOpen?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  background: transparent;
  border: none;
  font-family: 'Pretendard';
  font-size: 13px;
  font-weight: 600;
  color: ${colors.theme.light.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    color: ${colors.theme.light.text.primary};
    transition: all 0.2s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }

  &:hover {
    color: #2563eb;
    svg {
      color: #2563eb;
    }
  }

  html.dark & {
    color: ${colors.text.white};
    svg {
      color: ${colors.text.white};
    }
  }

  @media (max-width: 1600px) {
    font-size: 12px;
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const FilterMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px;
  min-width: 130px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 100;

  html.dark & {
    background: ${colors.background.primary};
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
`;

export const FilterMenuItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${({ $active }) =>
    $active ? 'rgba(37, 99, 235, 0.08)' : 'transparent'};
  border-radius: 8px;
  font-family: 'Pretendard';
  font-size: 14px;
  color: ${({ $active }) => ($active ? '#2563eb' : '#334155')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(37, 99, 235, 0.12);
    color: #2563eb;
  }

  .count {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${({ $active }) =>
      $active ? 'rgba(37, 99, 235, 0.12)' : '#e0e7ef'};
    color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
  }

  html.dark & {
    background: ${({ $active }) =>
      $active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    color: ${({ $active }) =>
      $active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
    .count {
      background: ${({ $active }) =>
        $active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
      color: ${({ $active }) =>
        $active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
    }
  }
`;

export const MapSection = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  align-items: stretch;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    gap: 15px;
    overflow: visible;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 8px;
    align-items: stretch;
    overflow-x: hidden;
  }
`;

export const LeftColumn = styled.div`
  width: 42%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 0;
  height: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: auto;
  }
  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 8px;
  }
`;

export const MapView = styled.div`
  flex: 0.684;
  width: 100%;
  min-height: 0;
  position: relative;
  background: ${colors.theme.light.surface};
  border-radius: ${colors.borderPreset.card.radius};
  padding: 0;
  aspect-ratio: 828 / 672;
  border: 1px solid ${colors.theme.light.border};
  box-shadow: ${colors.borderPreset.card.glow};
  height: 95%;

  &.danger {
    animation: danger-map-blink 0.7s infinite alternate;
  }

  @keyframes danger-map-blink {
    0% {
      background: #fff0f3;
      box-shadow: 0 0 32px #ff2d55, 0 0 64px #ff2d5533;
    }
    100% {
      background: #ffe5ea;
      box-shadow: 0 0 64px #ff2d55, 0 0 128px #ff2d5533;
    }
  }

  html.dark & {
    background: ${colors.background.primary};
    border: ${colors.borderPreset.card.width} ${colors.borderPreset.card.style}
      ${colors.borderPreset.card.color};
  }

  @media (max-width: 1024px) {
    min-height: 300px;
    aspect-ratio: auto;
    height: 300px;
    flex: none;
  }
  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    height: auto;
    border-radius: 0;
    overflow-x: hidden;
  }

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .sensor-icon {
    cursor: pointer;
    transition: all 0.3s ease;

    @keyframes pulse {
      0% {
        filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
      }
      50% {
        filter: brightness(1.5) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
      }
      100% {
        filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
      }
    }

    &[data-type='gas'] {
      fill: #04a777;
      filter: drop-shadow(0 0 5px rgba(4, 167, 119, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &[data-type='fire'] {
      fill: #d90368;
      filter: drop-shadow(0 0 5px rgba(217, 3, 104, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &[data-type='vibration'] {
      fill: #fb8b24;
      filter: drop-shadow(0 0 5px rgba(251, 139, 36, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &:hover {
      &[data-type='gas'] {
        filter: drop-shadow(0 0 8px rgba(4, 167, 119, 0.8));
      }

      &[data-type='fire'] {
        filter: drop-shadow(0 0 8px rgba(217, 3, 104, 0.8));
      }

      &[data-type='vibration'] {
        filter: drop-shadow(0 0 8px rgba(251, 139, 36, 0.8));
      }
    }
  }

  .sensor-icon.danger {
    filter: drop-shadow(0 0 24px #ff2d55) brightness(2) !important;
    animation: danger-blink 0.7s infinite alternate !important;
  }

  @keyframes danger-blink {
    0% {
      filter: drop-shadow(0 0 24px #ff2d55) brightness(2);
    }
    100% {
      filter: drop-shadow(0 0 48px #ff2d55) brightness(3);
    }
  }

  .sensor-icon.dimmed {
    filter: grayscale(1) opacity(0.3) !important;
    pointer-events: none;
    transition: filter 0.3s;
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

export const SensorIcon = styled.g`
  cursor: pointer;
  transition: all 0.3s ease;

  @keyframes pulse {
    0% {
      filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
    }
    100% {
      filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
    }
  }

  &[data-type='gas'] {
    fill: #04a777;
    filter: drop-shadow(0 0 5px rgba(4, 167, 119, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &[data-type='fire'] {
    fill: #d90368;
    filter: drop-shadow(0 0 5px rgba(217, 3, 104, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &[data-type='vibration'] {
    fill: #fb8b24;
    filter: drop-shadow(0 0 5px rgba(251, 139, 36, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &:hover {
    &[data-type='gas'] {
      filter: drop-shadow(0 0 8px rgba(4, 167, 119, 0.8));
    }

    &[data-type='fire'] {
      filter: drop-shadow(0 0 8px rgba(217, 3, 104, 0.8));
    }

    &[data-type='vibration'] {
      filter: drop-shadow(0 0 8px rgba(251, 139, 36, 0.8));
    }
  }
`;

export const SensorCard = styled.div`
  flex: 0.316;
  min-height: 0;
  background: ${colors.theme.light.surface};
  border-radius: ${colors.borderPreset.card.radius};
  padding: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.theme.light.border};
  box-shadow: 0 2px 8px rgba(29, 56, 120, 0.05);

  html.dark & {
    background: ${colors.theme.dark.surface};
    border: 1px solid ${colors.theme.dark.border};
    box-shadow: ${colors.borderPreset.card.glow};
  }

  @media (max-width: 1024px) {
    height: 300px;
    min-height: 300px;
    flex: none;
  }
  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0 2px;
    border-radius: 0;
    overflow-x: hidden;
  }
`;

export const SensorList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 4px;

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

  html.dark &::-webkit-scrollbar-track {
    background: ${colors.background.secondary};
  }
  html.dark &::-webkit-scrollbar-thumb {
    background: ${colors.border.color};
  }

  @media (max-width: 1024px) {
    height: calc(100% - 90px);
    overflow-y: auto;
  }
`;

export const SensorItem = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr) 80px;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.theme.light.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }

  > * {
    text-align: center;
    padding: 0 8px;
  }

  > *:last-child {
    text-align: right;
    padding-right: 0;
  }

  &.danger {
    background: #fff0f3;
    border: 2px solid #ff2d55;
    color: #ff2d55;
    animation: danger-blink-row 0.7s infinite alternate;
    box-shadow: 0 0 16px #ff2d55, 0 0 32px #ff2d5533;
  }

  @keyframes danger-blink-row {
    0% {
      background: #fff0f3;
      box-shadow: 0 0 16px #ff2d55, 0 0 32px #ff2d5533;
    }
    100% {
      background: #ffe5ea;
      box-shadow: 0 0 32px #ff2d55, 0 0 64px #ff2d5533;
    }
  }

  @media (max-width: 1600px) {
    gap: 6px;
    padding: 10px 12px;
    grid-template-columns: 100px repeat(4, 1fr) 70px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 100px repeat(2, 1fr);
    padding: 8px 10px;
    gap: 4px;

    > *:nth-of-type(5),
    > *:last-child {
      display: none;
    }
  }

  html.dark & {
    border-bottom: 1px solid ${colors.theme.dark.border};
  }
`;

export const SensorNo = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.theme.light.text.secondary};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  html.dark & {
    color: ${colors.theme.dark.text.secondary};
  }
`;

export const SensorType = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;
    .sensor-name {
      &:after {
        content: attr(data-short-name);
      }
    }
    .sensor-name-full {
      display: none;
    }
  }

  @media (min-width: 769px) {
    .sensor-name {
      &:after {
        content: attr(data-full-name);
      }
    }
    .sensor-name-short {
      display: none;
    }
  }
`;

export const SensorConnection = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${({ children }) =>
    children === '연결됨'
      ? '#34d399'
      : children === '연결안됨'
      ? '#ef4444'
      : '#2e7d32'};
  font-weight: 600;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const SensorStatus = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;

  color: ${({ status }) =>
    status === 'normal'
      ? '#34d399'
      : status === 'danger'
      ? '#ef4444'
      : '#2563eb'} !important;
  background: ${({ status }) =>
    status === 'normal'
      ? 'rgba(52, 211, 153, 0.12)'
      : status === 'danger'
      ? 'rgba(239, 68, 68, 0.12)'
      : '#eaf3fb'} !important;
  border: 1px solid
    ${({ status }) =>
      status === 'normal'
        ? 'rgba(52, 211, 153, 0.32)'
        : status === 'danger'
        ? 'rgba(239, 68, 68, 0.32)'
        : '#bae6fd'} !important;
  border-radius: 12px;
  margin: 0 auto;
  padding: 4px 12px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 8px;
  }

  html.dark & {
    color: ${({ status }) =>
      status === 'normal'
        ? '#34d399'
        : status === 'danger'
        ? '#ef4444'
        : '#2563eb'} !important;
    background: ${({ status }) =>
      status === 'normal'
        ? 'rgba(52, 211, 153, 0.18)'
        : status === 'danger'
        ? 'rgba(239, 68, 68, 0.18)'
        : '#eaf3fb'} !important;
    border: 1px solid
      ${({ status }) =>
        status === 'normal'
          ? 'rgba(52, 211, 153, 0.32)'
          : status === 'danger'
          ? 'rgba(239, 68, 68, 0.32)'
          : '#bae6fd'} !important;
  }
`;

export const SensorValue = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 13px;
  color: ${({ status }) =>
    status === 'normal'
      ? '#34d399'
      : status === 'danger'
      ? '#ef4444'
      : '#1e293b'};
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 60px;

  span {
    font-size: 12px;
    color: #64748b;
    margin-left: 4px;
  }

  @media (max-width: 1600px) {
    font-size: 12px;
    span {
      font-size: 11px;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }

  html.dark & {
    color: ${({ status }) =>
      status === 'normal'
        ? '#34d399'
        : status === 'danger'
        ? '#ef4444'
        : '#1e293b'};
    span {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const SensorTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  margin: 0;
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

export const VibrationGraphContainer = styled.div`
  width: 58%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
  height: 100%;
  min-height: 0;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(9, minmax(200px, auto));
    gap: 15px;
    margin-top: 15px;
  }
  @media (max-width: 768px) {
    grid-template-rows: repeat(9, minmax(320px, auto));
    gap: 12px;
  }
`;

export const VibrationGraphCard = styled.div`
  background: #fafdff;
  border-radius: 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  color: #1e293b;

  h4 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    color: #1e293b;
    margin: 0 0 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eaf3fb;
    padding: 8px 16px;
    border-radius: 16px;
    border: 1px solid #bae6fd;
    border-bottom: 1px solid #bae6fd;
    position: relative;

    .status {
      font-size: 13px;
      padding: 4px 10px;
      background: #eaf3fb;
      color: #2563eb;
      border-radius: 8px;
      border: 1px solid #bae6fd;
      margin-left: auto;
    }
  }

  .graph-container {
    flex: 1;
    background: #fff;
    border-radius: 16px;
    padding: 15px;
    min-height: 0;
    height: calc(100% - 46px);
    border: 1px solid #e0e7ef;
    border-top: 1px solid #e0e7ef !important;
    color: #334155;
  }

  p,
  span,
  .value,
  .label {
    color: #334155;
  }

  html.dark & {
    background: ${colors.theme.dark.surface};
    h4 {
      color: ${colors.theme.dark.text.primary};
      background: ${colors.theme.dark.surface};
      border: 1px solid ${colors.theme.dark.border};
      .status {
        background: var(--status-bg, rgba(16, 185, 129, 0.18));
        color: var(--status-color, #34d399);
        border: 1.5px solid var(--status-border, rgba(16, 185, 129, 0.5));
      }
    }
    .graph-container {
      background: ${colors.theme.dark.surface};
      border: 1px solid ${colors.theme.dark.border};
      border-top: 1px solid ${colors.theme.dark.border} !important;
    }
    p,
    span,
    .value,
    .label {
      color: ${colors.theme.dark.text.primary};
    }
  }
  @media (max-width: 768px) {
    min-height: 320px;
    height: 320px;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #eaf3fb;
  display: flex;
  flex-direction: column;

  html.dark & {
    background: linear-gradient(
      to bottom right,
      ${colors.gradient.main.from},
      ${colors.gradient.main.to}
    );
  }

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100vh;
  }
`;

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

export const BannerContent = styled.div`
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 32px;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 200px;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0;
    align-items: center;
    justify-content: center;
  }
`;

export const TitleContainer = styled.div`
  padding: 8px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  text-align: left;
  margin-top: 8px;
`;

export const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.02em;

  html.dark & {
    color: #f8fafc;
  }
`;

export const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 15px;
  text-align: center;
  color: #60a5fa;
  margin: 4px 0 0 0;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

export const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 14px;
  color: #2563eb;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e0ecff;
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid #bae6fd;

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
    display: none;
  }
`;

export const ContentSection = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100vh;
    padding: 15px;
  }
  @media (max-width: 768px) {
    height: 100vh;
    padding: 0;
    width: 100%;
    min-width: 0;
    margin: 0;
    overflow-x: hidden;
  }
`;

export const SensorTooltip = styled.div<{
  status: 'normal' | 'warning' | 'danger';
  arrowDirection?: 'up' | 'down';
}>`
  position: absolute;
  background: #fff;
  border: 1px solid
    ${({ status }) =>
      status === 'normal'
        ? 'rgba(16, 185, 129, 0.3)'
        : status === 'warning'
        ? 'rgba(245, 158, 11, 0.3)'
        : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  backdrop-filter: blur(8px);
  box-shadow: ${({ status }) =>
    status === 'normal'
      ? '0 0 15px rgba(16, 185, 129, 0.08), inset 0 0 20px rgba(16, 185, 129, 0.04)'
      : status === 'warning'
      ? '0 0 15px rgba(245, 158, 11, 0.08), inset 0 0 20px rgba(245, 158, 11, 0.04)'
      : '0 0 15px rgba(239, 68, 68, 0.08), inset 0 0 20px rgba(239, 68, 68, 0.04)'};
  z-index: 2000;
  margin-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    ${({ arrowDirection }) =>
      arrowDirection === 'up'
        ? `
      top: -8px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #fff;
      border-top: none;
    `
        : `
      bottom: -8px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #fff;
      border-bottom: none;
    `}
  }

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    ${({ arrowDirection, status }) =>
      arrowDirection === 'up'
        ? `
      top: -9px;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid ${
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.3)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(239, 68, 68, 0.3)'
      };
      border-top: none;
    `
        : `
      bottom: -9px;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid ${
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.3)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(239, 68, 68, 0.3)'
      };
      border-bottom: none;
    `}
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid
      ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.12)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.12)'
          : 'rgba(239, 68, 68, 0.12)'};

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ status }) =>
        status === 'normal'
          ? '#10B981'
          : status === 'warning'
          ? '#F59E0B'
          : '#EF4444'};
      box-shadow: 0 0 12px
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.3)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.3)'
            : 'rgba(239, 68, 68, 0.3)'};
    }

    .name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
    }

    .status-text {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.08)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.08)'
          : 'rgba(239, 68, 68, 0.08)'};
      color: ${({ status }) =>
        status === 'normal'
          ? '#10B981'
          : status === 'warning'
          ? '#F59E0B'
          : '#EF4444'};
      border: 1px solid
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.18)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.18)'
            : 'rgba(239, 68, 68, 0.18)'};
    }
  }

  .tooltip-content {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #64748b;
      }

      .value {
        color: #1e293b;
        font-weight: 500;
      }
    }
  }

  html.dark & {
    background: rgba(26, 32, 44, 0.95);
    border: 1px solid
      ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.5)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.5)'
          : 'rgba(239, 68, 68, 0.5)'};
    box-shadow: ${({ status }) =>
      status === 'normal'
        ? '0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)'
        : status === 'warning'
        ? '0 0 15px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(245, 158, 11, 0.1)'
        : '0 0 15px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'};
    &::after {
      border-top: 8px solid rgba(26, 32, 44, 0.95);
    }
    &::before {
      border-top: 9px solid
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.5)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.5)'
            : 'rgba(239, 68, 68, 0.5)'};
    }
    .tooltip-header {
      border-bottom: 1px solid
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.2)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(239, 68, 68, 0.2)'};
      .name {
        color: #ffffff;
      }
    }
    .tooltip-content {
      .label {
        color: #94a3b8;
      }
      .value {
        color: #ffffff;
      }
    }
  }
`;

export const LogButton = styled(NavLinkStyle)`
  && {
    svg {
      color: ${({ active }) =>
        active ? '#2563eb' : colors.theme.light.text.secondary};
    }
    &:hover {
      svg {
        color: #2563eb;
      }
    }
    html.dark & {
      svg {
        color: ${({ active }) =>
          active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
      }
      &:hover {
        svg {
          color: #ffffff;
        }
      }
    }
  }
`;

export const LogPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  width: 480px;
  max-width: 96vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2000;
  border: 1.5px solid #bae6fd;
  backdrop-filter: blur(16px);
  color: #1e293b;
  padding: 0;
  overflow: hidden;
  html.dark & {
    background: #23272f;
    border: 1px solid #334155;
    color: #f8fafc;
  }
`;

export const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 32px 8px 32px;
  background: transparent;
  border-bottom: none;
  gap: 12px;
  position: relative;
  h2 {
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 22px;
    color: #ff2d55;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
    text-align: center;
    width: 100%;
    justify-content: center;
  }
  html.dark & h2 {
    color: #ffd600;
  }
`;

export const LogContent = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 32px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  min-height: 120px;
`;

export const LogItem = styled.div<{ severity: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 15px;
  font-family: 'Pretendard';
  border-bottom: 1px solid #e5e7eb;
  color: ${({ severity }) =>
    severity === 'danger'
      ? '#ff2d55'
      : severity === 'warning'
      ? '#f59e42'
      : '#334155'};
  font-weight: ${({ severity }) =>
    severity === 'danger' ? 700 : severity === 'warning' ? 600 : 500};
  .status {
    font-weight: 700;
    min-width: 64px;
    text-align: center;
    color: ${({ severity }) =>
      severity === 'danger'
        ? '#ff2d55'
        : severity === 'warning'
        ? '#f59e42'
        : '#334155'};
  }
  .time {
    min-width: 80px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }
  .content {
    flex: 1;
    font-weight: 600;
    color: #222;
  }
  .value {
    min-width: 60px;
    text-align: right;
    color: #2563eb;
    font-weight: 600;
  }
  html.dark & {
    border-bottom: 1px solid #334155;
    color: ${({ severity }) =>
      severity === 'danger'
        ? '#ff2d55'
        : severity === 'warning'
        ? '#ffd600'
        : '#cbd5e1'};
    .status {
      color: ${({ severity }) =>
        severity === 'danger'
          ? '#ff2d55'
          : severity === 'warning'
          ? '#ffd600'
          : '#cbd5e1'};
    }
    .content {
      color: #f8fafc;
    }
    .value {
      color: #60a5fa;
    }
  }
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

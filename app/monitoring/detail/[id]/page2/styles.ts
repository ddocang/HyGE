import styled from 'styled-components';
import { colors } from '../../../../styles/colors';

export const MapSection = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  align-items: stretch;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    gap: 15px;
    overflow: visible;
  }
  @media (max-width: 768px) {
    display: block;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 0;
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
  box-sizing: border-box;
  flex-shrink: 1;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: auto;
  }
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 0;
    flex: none;
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
  box-sizing: border-box;
  flex-shrink: 1;
  overflow-x: hidden;

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
    display: block;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    height: auto;
    border-radius: 0;
    flex: none;
  }

  svg,
  img {
    max-width: 100%;
    width: 100%;
    display: block;
    overflow-x: hidden;
  }

  .sensor-icon {
    cursor: pointer;
    transition: all 0.3s ease;
    // ... existing code ...
  }

  .sensor-icon.danger {
    filter: drop-shadow(0 0 32px #ff2d55) drop-shadow(0 0 16px #fff700)
      brightness(2.5) !important;
    animation: danger-blink 0.5s infinite alternate,
      danger-scale 0.5s infinite alternate !important;
    transform: scale(1.18) rotate(-5deg);
    outline: 4px solid #fff700;
    outline-offset: 2px;
    z-index: 20;
  }

  @keyframes danger-blink {
    0% {
      filter: drop-shadow(0 0 32px #ff2d55) drop-shadow(0 0 16px #fff700)
        brightness(2.5);
    }
    100% {
      filter: drop-shadow(0 0 64px #ff2d55) drop-shadow(0 0 32px #fff700)
        brightness(3.5);
    }
  }

  @keyframes danger-scale {
    0% {
      transform: scale(1.18) rotate(-5deg);
    }
    100% {
      transform: scale(1.28) rotate(5deg);
    }
  }

  .sensor-icon.dimmed {
    filter: grayscale(1) opacity(0.3) !important;
    pointer-events: none;
    transition: filter 0.3s;
  }

  .danger-glow {
    filter: drop-shadow(0 0 24px #ff2d55) drop-shadow(0 0 12px #fff700);
    animation: danger-glow 0.7s infinite alternate;
  }
  @keyframes danger-glow {
    0% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
  .danger-shake {
    animation: danger-shake 0.5s infinite alternate;
  }
  @keyframes danger-shake {
    0% {
      transform: translateX(-2px) rotate(-5deg);
    }
    100% {
      transform: translateX(2px) rotate(5deg);
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
  box-sizing: border-box;
  flex-shrink: 1;

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
    display: block;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 0;
    flex: none;
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
  box-sizing: border-box;
  flex-shrink: 1;

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

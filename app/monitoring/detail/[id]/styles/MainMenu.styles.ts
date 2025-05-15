import styled from '@emotion/styled';
import { colors } from '@/app/styles/colors';

// 메인 메뉴 및 네비게이션 관련 스타일
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

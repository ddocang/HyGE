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
    font-weight: 400 !important;
    color: #222 !important;
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
    border: 1px solid #e2e8f0;
    backdrop-filter: blur(8px);

    &:hover {
      color: #222 !important;
      border-color: #222;
      background: rgba(96, 165, 250, 0.18);
      svg {
        color: #222 !important;
      }
    }

    svg {
      width: 18px;
      height: 18px;
      transition: all 0.2s ease;
      color: #222 !important;
    }

    html.dark & {
      color: #222 !important;
      background: ${({ active }) =>
        active ? 'rgba(96, 165, 250, 0.18)' : 'transparent'};
      border: none;
      font-weight: 400 !important;
      &:hover {
        color: #222 !important;
        border-color: #222;
        background: rgba(96, 165, 250, 0.18);
        svg {
          color: #222 !important;
        }
      }
    }
  }
`;

export const LogButton = styled(NavLinkStyle)`
  && {
    svg {
      color: #222 !important;
    }
    &:hover {
      svg {
        color: #222 !important;
      }
    }
    html.dark & {
      svg {
        color: #222 !important;
      }
      &:hover {
        svg {
          color: #222 !important;
        }
      }
      border: none;
    }
  }
`;

export const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 14px;
  color: #475569 !important;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent !important;
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid #e2e8f0 !important;

  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #222 !important;
    border-radius: 50%;
    box-shadow: 0 0 12px #222;
  }

  html.dark & {
    color: #fff !important;
    background: transparent !important;
    border: none !important;
    &:before {
      background: #fff !important;
      box-shadow: 0 0 12px #fff;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

'use client';

/** @jsxImportSource @emotion/react */
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const ThemeToggleButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #475569;
  transition: all 0.2s;
  cursor: pointer;
  padding: 8px 16px;
  margin-right: 4px;

  &.active {
    background: rgba(34, 34, 34, 0.08);
  }

  &:hover {
    background: rgba(34, 34, 34, 0.18);
    border-color: #e2e8f0;
    color: #475569;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #222;
    transition: color 0.2s;
  }

  html.dark & {
    border: none;
    color: #fff;
    svg {
      color: #fff;
    }
  }
`;

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeToggleButtonStyled
      onClick={toggleTheme}
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      {theme === 'light' ? (
        <MoonIcon
          width={18}
          height={18}
          stroke="#475569"
          fill="none"
          strokeWidth={2.2}
        />
      ) : (
        <SunIcon
          width={18}
          height={18}
          stroke="#fff"
          fill="none"
          strokeWidth={2.2}
        />
      )}
    </ThemeToggleButtonStyled>
  );
}

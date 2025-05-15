'use client';

/** @jsxImportSource @emotion/react */
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const ThemeToggleButtonStyled = styled.button`
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #2563eb;
  transition: all 0.2s;
  cursor: pointer;
  padding: 8px 16px;
  margin-right: 4px;

  &.active {
    background: rgba(96, 165, 250, 0.18);
  }

  &:hover {
    background: rgba(96, 165, 250, 0.28);
    border-color: #2563eb;
    color: #2563eb;
    transform: none;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #2563eb;
    transition: color 0.2s;
  }

  html.dark & {
    border: 1px solid #334155;
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
          width={24}
          height={24}
          stroke="#2563eb"
          fill="none"
          strokeWidth={2.2}
        />
      ) : (
        <SunIcon
          width={24}
          height={24}
          stroke="#2563eb"
          fill="none"
          strokeWidth={2.2}
        />
      )}
    </ThemeToggleButtonStyled>
  );
}

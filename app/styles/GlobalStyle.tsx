'use client';

import { Global, css } from '@emotion/react';

const GlobalStyle = () => (
  <Global
    styles={css`
      body {
        background: #f8fafc;
        color: #1e293b;
        transition: background 0.2s, color 0.2s;
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      html.dark body {
        background: #141414;
        color: #f8fafc;
      }
    `}
  />
);

export default GlobalStyle;

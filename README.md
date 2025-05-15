# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# 수소 충전소 정보 시스템

실시간 수소 충전소 정보를 제공하는 웹 애플리케이션입니다.

## 기능

- 실시간 수소 충전소 정보 조회
- 지역별 충전소 목록 확인
- 충전소 검색
- 실시간 충전 상태 및 대기 차량 정보
- 지도 기반 위치 확인

## 개발 환경 설정

1. 저장소 클론

```bash
git clone [repository-url]
cd [repository-name]
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.example` 파일을 참고하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```
NEXT_PUBLIC_NCP_CLIENT_ID=your_ncp_client_id
NCP_CLIENT_SECRET=your_ncp_client_secret
H2_API_KEY=your_hydrogen_api_key
```

4. 개발 서버 실행

```bash
npm run dev
```

## Vercel 배포 방법

1. GitHub에 코드를 푸시합니다.

2. Vercel 대시보드에서 새 프로젝트를 생성하고 GitHub 저장소를 연결합니다.

3. 환경 변수 설정:

   - `NEXT_PUBLIC_NCP_CLIENT_ID`: 네이버 클라우드 플랫폼 Client ID
   - `NCP_CLIENT_SECRET`: 네이버 클라우드 플랫폼 Client Secret
   - `H2_API_KEY`: 수소 충전소 API 키

4. 배포를 진행합니다.

## 기술 스택

- Next.js 14
- TypeScript
- Styled Components
- Naver Maps API
- 수소 충전소 Open API

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

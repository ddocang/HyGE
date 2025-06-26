const express = require('express');
const path = require('path');

const app = express();

// public/cctv 폴더의 HLS 스트림 파일을 서비스
app.use('/cctv', express.static(path.join(__dirname, 'public/cctv')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CCTV 서버 실행 중: http://localhost:${PORT}/cctv/stream.m3u8`);
});

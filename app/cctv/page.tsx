'use client';
import { useEffect, useRef } from 'react';

export default function CCTVPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // hls.js CDN 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (videoRef.current && (window as any).Hls) {
        const Hls = (window as any).Hls;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource('/cctv/stream.m3u8');
          hls.attachMedia(videoRef.current);
        } else if (
          videoRef.current.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoRef.current.src = '/cctv/stream.m3u8';
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        aspectRatio: '16 / 9',
        background: '#000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: '#000',
          margin: 0,
          padding: 0,
          border: 'none',
          boxShadow: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}
// cctv 명령어
// ffmpeg -rtsp_transport tcp -i "rtsp://admin:cctv1wsx2edc@175.114.113.233:50554/Streaming/Channels/101" -c:v libx264 -c:a aac -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments -hls_segment_filename public/cctv/stream%d.m2ts public/cctv/stream.m3u8
// 라즈베리파이 명령어
// python3 cors_server.py
// while true; do
//  /usr/local/bin/ffmpeg -rtsp_transport tcp -i "rtsp://admin:cctv1wsx2edc@175.114.113.233:50554/Streaming/Channels/101" -c:v libx264 -c:a aac -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments -hls_segment_filename ~/hyge-cctv/public/cctv/stream%d.m2ts ~/hyge-cctv/public/cctv/stream.m3u8
// sleep 2
// done

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        fontFamily: 'Pretendard',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>
        요청하신 페이지가 존재하지 않습니다.
      </p>
      <a
        href="/"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#27AFE9',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

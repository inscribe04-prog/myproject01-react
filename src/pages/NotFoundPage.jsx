import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1f1f1f)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      color: 'white',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '6rem', fontWeight: '700', margin: 0, opacity: 0.3 }}>404</h1>
        <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>Page not found</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" style={{
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #ffffff, #d1d5db)',
          color: '#1a1a1a',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '700'
        }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
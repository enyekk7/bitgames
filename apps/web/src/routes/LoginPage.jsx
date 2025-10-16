import { useState } from 'react';

export default function LoginPage({ onConnect }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnecting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(230, 126, 34, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(243, 156, 18, 0.1) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <div style={{
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {/* Logo & Welcome */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            BITGAME
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#aaa',
            marginBottom: '8px'
          }}>
            Gaming platform on Stacks
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{
          padding: '40px',
          textAlign: 'center',
          border: '2px solid var(--primary)',
          boxShadow: '0 20px 60px rgba(230, 126, 34, 0.3)',
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px',
            color: 'white'
          }}>
            Welcome Back!
          </h2>
          
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Connect your Stacks wallet to start playing games and earning STX tokens
          </p>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '24px',
              background: connecting 
                ? 'var(--bg-hover)' 
                : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              cursor: connecting ? 'wait' : 'pointer'
            }}
          >
            {connecting ? (
              <>
                <span style={{ marginRight: '12px' }}>⏳</span>
                Connecting...
              </>
            ) : (
              <>
                <span style={{ marginRight: '12px' }}>👛</span>
                Connect Wallet
              </>
            )}
          </button>

          <div style={{
            padding: '16px',
            background: 'rgba(230, 126, 34, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(230, 126, 34, 0.3)',
            marginBottom: '16px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--accent)',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Supported Wallets:
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#aaa'
            }}>
              <span>Leather</span>
              <span>•</span>
              <span>Xverse</span>
            </div>
          </div>

          <p style={{
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

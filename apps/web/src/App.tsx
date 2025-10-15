import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedPage from './routes/FeedPage';
import GamesPage from './routes/GamesPage';
import GameDetailPage from './routes/GameDetailPage';
import PlayPage from './routes/PlayPage';
import ProfilePage from './routes/ProfilePage';
import LoginPage from './routes/LoginPage';
import { connectWallet, disconnectWallet, getStxAddress, isWalletConnected } from './wallet/stacksConnect';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if wallet is already connected
    if (isWalletConnected()) {
      const address = getStxAddress();
      setWalletAddress(address);
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
      const address = getStxAddress();
      setWalletAddress(address);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error; // Re-throw to handle in LoginPage
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setIsAuthenticated(false);
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'bounce 2s ease-in-out infinite' }}>
            🎮
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <LoginPage onConnect={handleConnect} />
      </BrowserRouter>
    );
  }

  // Show main app if authenticated
  return (
    <BrowserRouter>
      <div>
        <ConditionalHeader />
        <Routes>
          <Route path="/" element={<FeedPage walletAddress={walletAddress} />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/bitgame/:slug" element={<GameDetailPage />} />
          <Route path="/bitgame/:slug/play" element={<PlayPage walletAddress={walletAddress} />} />
          <Route path="/u/me" element={<ProfilePage walletAddress={walletAddress} onConnect={handleConnect} onDisconnect={handleDisconnect} />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

function ConditionalHeader() {
  const location = useLocation();
  
  // Don't show header on play pages
  if (location.pathname.includes('/play')) {
    return null;
  }
  
  return <Header />;
}

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">BITGAME</Link>
      </div>
    </header>
  );
}

function BottomNav() {
  const location = useLocation();
  
  // Don't show bottom nav on play page
  if (location.pathname.includes('/play')) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <img 
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/g65FtoqzXX8t/20251015_085639-IUlDaTuAM4K1gKGTE1IupNGAc1ZmTR.png?csIk" 
          alt="Home" 
          className="nav-icon"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      </Link>
      <Link 
        to="/games" 
        className={`nav-item ${location.pathname === '/games' ? 'active' : ''}`}
      >
        <img 
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/g65FtoqzXX8t/20251015_085651-yggRrqrYiEwWdjEtqgwJ4f9pIDjesS.png?uwiw" 
          alt="Games" 
          className="nav-icon"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      </Link>
      <Link 
        to="/u/me" 
        className={`nav-item ${location.pathname === '/u/me' ? 'active' : ''}`}
      >
        <img 
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/g65FtoqzXX8t/20251015_085701-4VqOLszVwqLgC6dtJOndM9vahOBD2X.png?w9ba" 
          alt="Profile" 
          className="nav-icon"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      </Link>
    </nav>
  );
}

export default App;



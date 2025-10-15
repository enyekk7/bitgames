import { useState, useEffect } from 'react';
import { readStxBalance } from '../wallet/stacksConnect';
import { api } from '../lib/api';

interface ProfilePageProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

// Level/XP calculation functions
const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 1000) + 1;
};

const calculateXPForLevel = (level: number): number => {
  return (level - 1) * 1000;
};

const calculateXPProgress = (xp: number): { current: number; next: number; progress: number } => {
  const level = calculateLevel(xp);
  const currentLevelXP = calculateXPForLevel(level);
  const nextLevelXP = calculateXPForLevel(level + 1);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  return {
    current: xp - currentLevelXP,
    next: nextLevelXP - currentLevelXP,
    progress: Math.min(progress, 100)
  };
};

export default function ProfilePage({ walletAddress, onConnect, onDisconnect }: ProfilePageProps) {
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // New state for level/XP system
  const [userStats, setUserStats] = useState({
    totalGamesPlayed: 0,
    totalScore: 0,
    xp: 0,
    level: 1,
    achievements: [] as string[],
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: ''
  });

  // Reset state on component mount
  useEffect(() => {
    setUsername('');
    setUsernameChanged(false);
    setIsEditingUsername(false);
    setNewUsername('');
    setUsernameError(null);
    setLoading(true);
    
    // Force refresh profile data on mount to prevent stale data
    if (walletAddress) {
      loadProfile();
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      // Reset state when wallet address changes
      setUsername('');
      setUsernameChanged(false);
      setIsEditingUsername(false);
      setNewUsername('');
      setUsernameError(null);
      setLoading(true);
      
      loadProfile();
      loadBalance();
      loadUserStats();
    }
  }, [walletAddress]);

  // Auto-refresh user stats every 2 seconds for real-time updates
  useEffect(() => {
    if (walletAddress) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing user stats...');
        loadUserStats();
      }, 2000); // Every 2 seconds for real-time updates
      
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  const loadProfile = async () => {
    if (!walletAddress) return;
    try {
      // Set loading state to prevent flicker
      setLoading(true);
      const profile = await api.getProfile(walletAddress);
      setUsername(profile.username || '');
      setUsernameChanged(profile.usernameChanged || false);
      
      // Load user stats for level/XP system
      await loadUserStats();
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Reset to default values on error
      setUsername('');
      setUsernameChanged(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!walletAddress) return;
    try {
      console.log('🔧 ProfilePage: Loading user stats for:', walletAddress);
      const apiUrl = 'http://localhost:3001'; // Hardcoded for testing
      console.log('🔧 ProfilePage: Using API URL:', apiUrl);
      
      // Try to fetch from API first
      const response = await fetch(`${apiUrl}/api/xp/${walletAddress}`);
      console.log('🔧 ProfilePage: API response status:', response.status);
      
      if (response.ok) {
        const userXPData = await response.json();
        console.log('🔧 ProfilePage: User XP data:', userXPData);
        
        const stats = {
          totalGamesPlayed: userXPData.totalGamesPlayed || 0,
          totalScore: userXPData.totalScore || 0,
          xp: userXPData.totalXP || 0,
          level: userXPData.level || 1,
          achievements: userXPData.achievements || [],
          currentStreak: userXPData.currentStreak || 0,
          longestStreak: userXPData.longestStreak || 0,
          lastPlayedDate: userXPData.lastPlayedDate || ''
        };
        
        setUserStats(stats);
        
        // Save to localStorage as backup
        localStorage.setItem(`userXP_${walletAddress}`, JSON.stringify(stats));
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('Failed to load user stats from API, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const savedStats = localStorage.getItem(`userXP_${walletAddress}`);
        if (savedStats) {
          const stats = JSON.parse(savedStats);
          setUserStats(stats);
          console.log('✅ Loaded stats from localStorage:', stats);
        } else {
          throw new Error('No saved stats found');
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
        // Final fallback to default values
        setUserStats({
          totalGamesPlayed: 0,
          totalScore: 0,
          xp: 0,
          level: 1,
          achievements: [],
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: ''
        });
      }
    }
  };

  const loadBalance = async () => {
    if (!walletAddress) return;
    try {
      const balance = await readStxBalance(walletAddress);
      setStxBalance(balance); // Already in STX (converted from microSTX)
    } catch (error) {
      console.error('Failed to load STX balance:', error);
    }
    // Don't set loading to false here - let loadProfile handle it
  };

  const handleUpdateUsername = async () => {
    if (!walletAddress || !newUsername.trim()) return;
    
    setUsernameError(null);
    setUpdating(true);

    try {
      const result = await api.updateUsername(walletAddress, newUsername.trim());
      setUsername(result.user.username);
      setUsernameChanged(result.user.usernameChanged);
      setIsEditingUsername(false);
      setNewUsername('');
      
      // Force refresh profile data to ensure we have the latest data
      await loadProfile();
    } catch (error) {
      setUsernameError((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👛</div>
            <h2 style={{ marginBottom: '8px' }}>Connect Your Wallet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Please connect your wallet to view your profile
            </p>
            <button onClick={onConnect} className="btn btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 8px rgba(230, 126, 34, 0.3); }
            50% { box-shadow: 0 0 16px rgba(230, 126, 34, 0.6); }
          }
          
          .profile-card {
            transition: all 0.3s ease;
          }
          
          .profile-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(230, 126, 34, 0.2);
          }
          
          .stat-card {
            transition: all 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          }
          
          .level-progress {
            position: relative;
            overflow: hidden;
          }
          
          .level-progress::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 2s infinite;
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          .achievement-badge {
            transition: all 0.3s ease;
          }
          
          .achievement-badge:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
          }
          
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            
            .profile-header {
              padding: 16px !important;
            }
            
            .action-buttons {
              flex-direction: column !important;
            }
          }
        `}
      </style>
      <div className="container">
        <h1 style={{ marginBottom: '24px', fontSize: '32px', fontWeight: '700', textAlign: 'center' }}>Profile</h1>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Main Profile Card */}
          <div className="card profile-card" style={{ 
            padding: '24px', 
            marginBottom: '20px', 
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
            border: '2px solid rgba(230, 126, 34, 0.3)',
            borderRadius: '20px'
          }}>
            {/* Edit Profile Button */}
            {!loading && !usernameChanged && (
              <button
                onClick={() => setIsEditingUsername(true)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  zIndex: 10
                }}
                title="Edit username (only once)"
              >
                Edit Profile
              </button>
            )}

            {/* Profile Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 8px 24px rgba(230, 126, 34, 0.3)'
              }}>
                👤
              </div>
              
              <h2 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '24px',
                fontWeight: '700',
                color: 'white'
              }}>
                @{loading ? 'Loading...' : (username || walletAddress.slice(0, 8))}
              </h2>
              
              <p style={{ 
                fontSize: '11px', 
                fontFamily: 'monospace', 
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                {walletAddress}
              </p>
            </div>

            {/* Level/XP Progress Bar */}
            {!loading && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    🏆 Level {userStats.level}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)' 
                  }}>
                    {userStats.xp} XP
                  </span>
                </div>
                
                <div className="level-progress" style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${calculateXPProgress(userStats.xp).progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                    boxShadow: '0 0 8px rgba(230, 126, 34, 0.5)'
                  }} />
                </div>
                
                <div style={{ 
                  fontSize: '10px', 
                  color: 'var(--text-secondary)', 
                  marginTop: '4px',
                  textAlign: 'center'
                }}>
                  {calculateXPProgress(userStats.xp).current} / {calculateXPProgress(userStats.xp).next} XP to next level
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons" style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                style={{ 
                  fontSize: '12px',
                  padding: '8px 16px'
                }}
              >
                📋 Copy Address
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onDisconnect}
                style={{ 
                  fontSize: '12px',
                  padding: '8px 16px'
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* STX Balance Card */}
            <div className="card stat-card" style={{ 
              padding: '20px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
              border: '1px solid rgba(230, 126, 34, 0.3)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                marginBottom: '8px' 
              }}>
                💰
              </div>
              <h3 style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                STX Balance
              </h3>
              {loading ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</p>
              ) : (
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: 'var(--primary)',
                  margin: '0'
                }}>
                  {stxBalance.toFixed(2)}
                </p>
              )}
            </div>

            {/* Games Played Card */}
            <div className="card stat-card" style={{ 
              padding: '20px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
              border: '1px solid rgba(0, 212, 170, 0.3)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                marginBottom: '8px' 
              }}>
                🎮
              </div>
              <h3 style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Games Played
              </h3>
              <p style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: 'var(--success)',
                margin: '0'
              }}>
                {userStats.totalGamesPlayed}
              </p>
            </div>

            {/* Total Score Card */}
            <div className="card stat-card" style={{ 
              padding: '20px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                marginBottom: '8px' 
              }}>
                🏆
              </div>
              <h3 style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Total Score
              </h3>
              <p style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: 'var(--error)',
                margin: '0'
              }}>
                {userStats.totalScore.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Achievements */}
          {userStats.achievements.length > 0 && (
            <div className="card" style={{ 
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'var(--warning)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                🏅 Achievements
              </h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                justifyContent: 'center'
              }}>
                {userStats.achievements.map((achievement, index) => (
                  <span 
                    key={index}
                    className="achievement-badge"
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: 'var(--warning)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Edit Username Modal */}
      {isEditingUsername && (
        <div 
          className="modal-overlay" 
          onClick={() => {
            setIsEditingUsername(false);
            setUsernameError(null);
            setNewUsername('');
          }}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out',
              border: '2px solid var(--primary)',
              maxWidth: '500px'
            }}
          >
            <div className="modal-header" style={{ paddingBottom: '20px' }}>
              <h2 className="modal-title" style={{ 
                fontSize: '24px', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ✏️ Set Your Username
              </h2>
            </div>

            <div style={{ 
              background: 'rgba(230, 126, 34, 0.1)', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid var(--primary)'
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                ⚠️ You can only set your username <strong style={{ color: 'var(--primary)' }}>once</strong>! Choose wisely.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setUsernameError(null);
                }}
                placeholder="Enter username (3-20 characters)"
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: `2px solid ${usernameError ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  if (!usernameError) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }
                }}
                onBlur={(e) => {
                  if (!usernameError) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                💡 Letters, numbers, and underscores only
              </p>
            </div>

            {usernameError && (
              <div style={{
                background: 'var(--error)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                ❌ {usernameError}
              </div>
            )}

            <div className="flex gap-2">
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => {
                  setIsEditingUsername(false);
                  setUsernameError(null);
                  setNewUsername('');
                }}
                disabled={updating}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ 
                  flex: 2,
                  background: updating ? 'var(--bg-hover)' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                }}
                onClick={handleUpdateUsername}
                disabled={updating || !newUsername.trim() || newUsername.trim().length < 3}
              >
                {updating ? (
                  <>
                    <span style={{ marginRight: '8px' }}>⏳</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '8px' }}>✅</span>
                    Set Username
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



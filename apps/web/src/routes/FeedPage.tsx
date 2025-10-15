import { useState, useEffect } from 'react';
import { api, Post } from '../lib/api';
import PostCard from '../components/PostCard';

interface FeedPageProps {
  walletAddress: string | null;
}

export default function FeedPage({ walletAddress }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await api.getFeed();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="flex-center" style={{ minHeight: '400px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ 
          marginBottom: '24px', 
          fontSize: '32px', 
          fontWeight: '700',
          paddingBottom: '16px',
          borderBottom: '3px solid var(--primary)',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Feed
        </h1>

        {posts.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎮</div>
            <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>No posts yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Play some games and share your scores!
            </p>
            <a href="/games" className="btn btn-primary">
              Browse Games
            </a>
          </div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {posts.map((post, index) => (
              <div key={post._id} style={{ 
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s backwards`
              }}>
                <PostCard 
                  post={post} 
                  walletAddress={walletAddress}
                  onTipSuccess={loadFeed}
                />
                {index < posts.length - 1 && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '20px 0',
                    gap: '12px'
                  }}>
                    <div style={{ 
                      flex: 1,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent 0%, var(--border) 100%)'
                    }} />
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                      boxShadow: '0 0 8px rgba(230, 126, 34, 0.5)'
                    }} />
                    <div style={{ 
                      flex: 1,
                      height: '2px',
                      background: 'linear-gradient(90deg, var(--border) 0%, transparent 100%)'
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



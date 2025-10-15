import { useState } from 'react';
import { Post, api } from '../lib/api';
import { sendStxTip } from '../wallet/stacksConnect';

interface PostCardProps {
  post: Post;
  walletAddress: string | null;
  onTipSuccess?: () => void;
}

export default function PostCard({ post, walletAddress, onTipSuccess }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipping, setTipping] = useState(false);

  // Debug template data
  console.log('🎨 PostCard received template:', post.template);
  console.log('🎮 PostCard received game:', post.game);
  console.log('📝 PostCard full post:', post);

  const handleLike = async () => {
    if (!walletAddress) return;
    try {
      const result = await api.likePost(post._id, walletAddress);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  // Repost feature removed - only Like and Tip available

  const handleTip = async () => {
    if (!walletAddress || !tipAmount) return;
    setTipping(true);
    try {
      const amount = parseFloat(tipAmount); // Amount in STX (e.g., 0.5 STX)
      
      // Send STX tip (native Stacks token) - conversion to microSTX handled internally
      const txId = await sendStxTip(
        post.author.address, 
        amount,
        `Tip for ${post.game?.name || 'your post'} 💎`
      );
      
      await api.recordTip(post._id, {
        from: walletAddress,
        amount: amount, // Store in STX
        txId
      });

      setShowTipModal(false);
      setTipAmount('');
      onTipSuccess?.();
      alert('💎 STX tip sent successfully!');
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert('Failed to send tip: ' + (error as Error).message);
    } finally {
      setTipping(false);
    }
  };

  const totalTips = post.tips.reduce((sum, tip) => sum + tip.amount, 0); // Already in STX

  return (
    <>
      <div className="card" style={{ 
        padding: '20px',
        background: 'rgba(26, 26, 26, 0.6)',
        border: '1px solid rgba(230, 126, 34, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        marginBottom: '0'
      }}>
        <div className="flex gap-3" style={{ marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            border: '3px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            flexShrink: 0
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: '900', 
              fontSize: '20px', 
              color: 'white',
              marginBottom: '4px'
            }}>
              @{post.author.username || post.author.address.slice(0, 8)}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#888'
            }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <p style={{ 
          marginBottom: '16px', 
          lineHeight: '1.6', 
          color: 'white',
          fontSize: '15px'
        }}>{post.content}</p>

        {post.game && (
          <div style={{
            background: post.template?.background || 'linear-gradient(135deg, #E8E8E8 0%, #F5F5F5 100%)',
            padding: '80px 20px',
            borderRadius: '12px',
            marginBottom: '16px',
            textAlign: 'center',
            border: `2px solid ${post.template?.borderColor || '#ddd'}`,
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative elements based on template */}
            {post.template?.id === 'cloud' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>☁️</div>
            )}
            {post.template?.id === 'fire' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>🔥</div>
            )}
            {post.template?.id === 'ocean' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>🌊</div>
            )}
            {post.template?.id === 'space' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>⭐</div>
            )}
            {post.template?.id === 'rainbow' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>🌈</div>
            )}
            {post.template?.id === 'forest' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>🌲</div>
            )}
            {post.template?.id === 'sunset' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.3
              }}>🌅</div>
            )}
            
            {post.score !== undefined && (
              <div>
                <div style={{ 
                  color: post.template?.textColor || '#666', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {post.game.name}
                </div>
                <div style={{ 
                  color: post.template?.scoreColor || '#E67E22', 
                  fontSize: '32px', 
                  fontWeight: '900',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {post.score.toLocaleString()}
                </div>
                <div style={{ 
                  color: post.template?.textColor || '#999', 
                  fontSize: '12px', 
                  marginTop: '4px'
                }}>
                  points
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex" style={{ 
          borderTop: 'none',
          paddingTop: '12px',
          justifyContent: 'space-around',
          gap: '8px'
        }}>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              color: liked ? '#ff4444' : 'white',
              fontSize: '36px',
              cursor: walletAddress ? 'pointer' : 'not-allowed',
              opacity: walletAddress ? 1 : 0.4,
              transition: 'all 0.3s ease',
              padding: '8px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={handleLike}
            disabled={!walletAddress}
            onMouseEnter={(e) => {
              if (walletAddress) {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'none';
            }}
          >
{liked ? '♥' : '♡'}
            {likesCount > 0 && (
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{likesCount}</span>
            )}
          </button>
          
          {/* Repost and Bookmark removed - only Like and Tip */}
          
          <button 
            style={{ 
              background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: walletAddress ? 'pointer' : 'not-allowed',
              opacity: walletAddress ? 1 : 0.4,
              transition: 'all 0.3s ease',
              padding: '8px 16px',
              borderRadius: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onClick={() => setShowTipModal(true)}
            disabled={!walletAddress}
            onMouseEnter={(e) => {
              if (walletAddress) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)';
            }}
          >
            TIP
          </button>
        </div>
      </div>

      {showTipModal && (
        <div className="modal-overlay" onClick={() => setShowTipModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                💎 Send STX Tip
              </h2>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(230, 126, 34, 0.1)',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid rgba(230, 126, 34, 0.3)'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Send STX to
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                {post.author.username || `@${post.author.address.slice(0, 10)}...`}
              </div>
            </div>

            <input
              type="number"
              placeholder="Amount (STX)"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              step="0.1"
              min="0.1"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-hover)',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                marginBottom: '8px',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
              }}
            />
            
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              ⚡ Minimum: 0.1 STX
            </div>

            <div className="flex gap-2">
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setShowTipModal(false)}
                disabled={tipping}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={handleTip}
                disabled={tipping || !tipAmount || parseFloat(tipAmount) < 0.1}
              >
                {tipping ? '⏳ Sending...' : '💎 Send STX'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



import { useState } from 'react';

interface ShareModalProps {
  gameSlug: string;
  gameName: string;
  score: number;
  onShare: (message: string) => Promise<void>;
  onClose: () => void;
  onPlayAgain?: () => void;
}

// Template options for share feed
const SHARE_TEMPLATES = [
  {
    id: 'default',
    name: 'Classic',
    emoji: '🎮',
    background: 'linear-gradient(135deg, #E8E8E8 0%, #F5F5F5 100%)',
    borderColor: '#ddd',
    textColor: '#333',
    scoreColor: '#E67E22'
  },
  {
    id: 'cloud',
    name: 'Cloudy Sky',
    emoji: '☁️',
    background: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #F0F8FF 100%)',
    borderColor: '#87CEEB',
    textColor: '#2C3E50',
    scoreColor: '#3498DB'
  },
  {
    id: 'fire',
    name: 'Fire Power',
    emoji: '🔥',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
    borderColor: '#FF6B35',
    textColor: '#FFFFFF',
    scoreColor: '#FFD700'
  },
  {
    id: 'ocean',
    name: 'Ocean Wave',
    emoji: '🌊',
    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 50%, #87CEEB 100%)',
    borderColor: '#1E3C72',
    textColor: '#FFFFFF',
    scoreColor: '#87CEEB'
  },
  {
    id: 'space',
    name: 'Space Galaxy',
    emoji: '🚀',
    background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
    borderColor: '#302B63',
    textColor: '#FFFFFF',
    scoreColor: '#FFD700'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    emoji: '🌈',
    background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
    borderColor: '#FF6B6B',
    textColor: '#2C3E50',
    scoreColor: '#E17055'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    emoji: '🌲',
    background: 'linear-gradient(135deg, #134E5E 0%, #71B280 50%, #A8E6CF 100%)',
    borderColor: '#134E5E',
    textColor: '#FFFFFF',
    scoreColor: '#A8E6CF'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FECFEF 100%)',
    borderColor: '#FF9A9E',
    textColor: '#2C3E50',
    scoreColor: '#E84393'
  }
];

export default function ShareModal({ gameSlug: _gameSlug, gameName, score, onShare, onClose, onPlayAgain }: ShareModalProps) {
  const [message, setMessage] = useState(`Just scored ${score.toLocaleString()} in ${gameName}! 🎮`);
  const [sharing, setSharing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const selectedTemplateData = SHARE_TEMPLATES.find(t => t.id === selectedTemplate);
      const shareData = {
        message,
        template: selectedTemplateData
      };
      await onShare(JSON.stringify(shareData));
      handleClose();
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to share score');
    } finally {
      setSharing(false);
    }
  };

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    }
    handleClose();
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleClose}
      style={{
        animation: isClosing ? 'fadeOut 0.3s ease-in' : 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isClosing ? 'slideDown 0.3s ease-in' : 'slideUp 0.3s ease-out',
          border: '2px solid var(--primary)',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        <div className="modal-header" style={{ paddingBottom: '15px' }}>
          <h2 className="modal-title" style={{ 
            fontSize: '24px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0'
          }}>
            🎉 Amazing Score!
          </h2>
        </div>

        {/* Template Preview */}
        <div style={{
          background: SHARE_TEMPLATES.find(t => t.id === selectedTemplate)?.background || SHARE_TEMPLATES[0].background,
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '15px',
          textAlign: 'center',
          border: `2px solid ${SHARE_TEMPLATES.find(t => t.id === selectedTemplate)?.borderColor || SHARE_TEMPLATES[0].borderColor}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements based on template */}
          {selectedTemplate === 'cloud' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>☁️</div>
          )}
          {selectedTemplate === 'fire' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>🔥</div>
          )}
          {selectedTemplate === 'ocean' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>🌊</div>
          )}
          {selectedTemplate === 'space' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>⭐</div>
          )}
          {selectedTemplate === 'rainbow' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>🌈</div>
          )}
          {selectedTemplate === 'forest' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>🌲</div>
          )}
          {selectedTemplate === 'sunset' && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              opacity: 0.3
            }}>🌅</div>
          )}
          
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '12px', 
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' 
          }}>
            {SHARE_TEMPLATES.find(t => t.id === selectedTemplate)?.emoji || '🏆'}
          </div>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: '900', 
            color: SHARE_TEMPLATES.find(t => t.id === selectedTemplate)?.scoreColor || 'var(--primary)', 
            marginBottom: '6px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {score.toLocaleString()}
          </div>
          <div style={{ 
            color: SHARE_TEMPLATES.find(t => t.id === selectedTemplate)?.textColor || 'var(--text-secondary)', 
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {gameName}
          </div>
        </div>

        {/* Template Selection */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '13px', 
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Choose your style:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {SHARE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                style={{
                  padding: '8px 6px',
                  background: selectedTemplate === template.id 
                    ? 'var(--primary)' 
                    : 'var(--bg-hover)',
                  border: `2px solid ${selectedTemplate === template.id 
                    ? 'var(--primary)' 
                    : 'var(--border)'}`,
                  borderRadius: '6px',
                  color: selectedTemplate === template.id 
                    ? 'white' 
                    : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
                onMouseEnter={(e) => {
                  if (selectedTemplate !== template.id) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTemplate !== template.id) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              >
                <span>{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '13px', 
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Share your achievement:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell everyone about your amazing score! 🎮✨"
            rows={2}
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--bg-hover)',
              border: '2px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              resize: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '12px' 
        }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
            onClick={handlePlayAgain}
            disabled={sharing}
          >
            🔄 Play Again
          </button>
          <button 
            className="btn btn-primary" 
            style={{ 
              flex: 2,
              background: sharing ? 'var(--bg-hover)' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={handleShare}
            disabled={sharing || !message.trim()}
          >
            {sharing ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Sharing...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>📤</span>
                Share to Feed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



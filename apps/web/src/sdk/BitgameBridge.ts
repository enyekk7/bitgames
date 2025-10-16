/**
 * BitgameBridge - SDK for game <-> portal communication
 * 
 * Usage in games:
 * 
 * import BitgameBridge from './BitgameBridge';
 * 
 * const bridge = new BitgameBridge();
 * 
 * // Game over
 * bridge.gameOver(1000, { level: 5, time: 120 });
 */

export interface GameOverData {
  score: number;
  metadata?: Record<string, any>;
  xpGained?: number;
  leveledUp?: boolean;
  newAchievements?: string[];
}

export type GameEventHandler = (data: GameOverData) => void;

class BitgameBridge {
  private listeners: { [event: string]: GameEventHandler[] } = {};

  constructor() {
    // Listen for messages from iframe games
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
    }
  }

  // For games to call
  gameOver(score: number, metadata?: Record<string, any>) {
    this.emit('game-over', { score, metadata });
  }

  // Calculate XP: 1 score = 1 XP (simple system)
  calculateXP(score: number, gameSlug: string, totalGamesPlayed: number = 0): number {
    // Simple system: 1 score = 1 XP
    return Math.max(1, score); // Minimum 1 XP even for score 0
  }

  // Update XP for user
  async updateXP(playerAddress: string, score: number, gameSlug: string): Promise<{ xpGained: number; leveledUp: boolean; newAchievements: string[] }> {
    try {
      console.log('🔧 BitgameBridge: Starting XP update for:', { playerAddress, score, gameSlug });
      
      // Get current user stats first to calculate consistency bonus
      let totalGamesPlayed = 0;
      const apiUrl = 'https://api-r4ha0h3ep-enyeks-projects-61a9bb1e.vercel.app';
      console.log('🔧 BitgameBridge: Environment REACT_APP_API_URL:', typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : 'undefined');
      console.log('🔧 BitgameBridge: Using API URL:', apiUrl);
      
      try {
        console.log('🔧 BitgameBridge: Fetching user stats from:', `${apiUrl}/api/xp/${playerAddress}`);
        const userResponse = await fetch(`${apiUrl}/api/xp/${playerAddress}`);
        console.log('🔧 BitgameBridge: User stats response status:', userResponse.status);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          totalGamesPlayed = userData.totalGamesPlayed || 0;
          console.log('🔧 BitgameBridge: Current totalGamesPlayed:', totalGamesPlayed);
        } else {
          console.log('🔧 BitgameBridge: User stats not found, using default');
        }
      } catch (error) {
        console.log('🔧 BitgameBridge: Could not fetch user stats, using default:', error);
      }
      
      const xpToAdd = this.calculateXP(score, gameSlug, totalGamesPlayed);
      console.log('🔧 BitgameBridge: Calculated XP to add:', xpToAdd);
      
      console.log('🔧 BitgameBridge: Sending XP update to:', `${apiUrl}/api/xp/${playerAddress}/add`);
      const response = await fetch(`${apiUrl}/api/xp/${playerAddress}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xpToAdd,
          gameScore: score,
          gameSlug
        })
      });
      
      console.log('🔧 BitgameBridge: XP update response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to update XP');
      }
      
      const result = await response.json();
      console.log('🔧 BitgameBridge: XP update result:', result);
      
      // Save to localStorage as backup
      try {
        const savedStats = localStorage.getItem(`userXP_${playerAddress}`);
        if (savedStats) {
          const stats = JSON.parse(savedStats);
          stats.xp += result.xpGained;
          stats.totalGamesPlayed += 1;
          stats.totalScore += score;
          stats.level = result.userXP?.level || stats.level;
          stats.achievements = [...(stats.achievements || []), ...(result.newAchievements || [])];
          localStorage.setItem(`userXP_${playerAddress}`, JSON.stringify(stats));
          console.log('🔧 BitgameBridge: Saved to localStorage:', stats);
        }
      } catch (error) {
        console.error('Failed to save XP to localStorage:', error);
      }
      
      console.log('🔧 BitgameBridge: Returning XP result:', {
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        newAchievements: result.newAchievements || []
      });
      
      return {
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        newAchievements: result.newAchievements || []
      };
    } catch (error) {
      console.error('XP update error:', error);
      // Return default values on error
      return {
        xpGained: 0,
        leveledUp: false,
        newAchievements: []
      };
    }
  }

  // For portal to listen
  on(event: string, handler: GameEventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off(event: string, handler: GameEventHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  private emit(event: string, data: GameOverData) {
    // Post message to parent (if in iframe)
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'bitgame', event, data }, '*');
    }

    // Call local listeners
    if (this.listeners[event]) {
      this.listeners[event].forEach(handler => handler(data));
    }
  }

  private handleMessage(event: MessageEvent) {
    if (event.data?.type === 'bitgame') {
      const { event: eventName, data } = event.data;
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(handler => handler(data));
      }
    }
  }
}

export default BitgameBridge;




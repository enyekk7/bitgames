const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export interface Game {
  _id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  type: 'react' | 'html';
  category: string;
  featured: boolean;
  playCount: number;
}

export interface Post {
  _id: string;
  type: 'score';
  author: {
    address: string;
    username?: string;
    avatar?: string;
  };
  content: string;
  game?: {
    slug: string;
    name: string;
    thumbnail: string;
  };
  score?: number;
  likes: number;
  template?: {
    id: string;
    name: string;
    emoji: string;
    background: string;
    borderColor: string;
    textColor: string;
    scoreColor: string;
  };
  tips: Array<{
    from: string;
    amount: number;
    txId: string;
    timestamp: Date;
  }>;
  createdAt: Date;
}

export const api = {
  // Games
  async getGames(): Promise<Game[]> {
    const res = await fetch(`${API_URL}/games`);
    return res.json();
  },

  async getGame(slug: string): Promise<Game> {
    const res = await fetch(`${API_URL}/games/${slug}`);
    return res.json();
  },

  async submitScore(slug: string, data: {
    playerAddress: string;
    score: number;
    metadata?: any;
    shareMessage?: string;
    template?: any;
  }) {
    const res = await fetch(`${API_URL}/games/${slug}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(slug: string, limit = 10) {
    const res = await fetch(`${API_URL}/leaderboard/${slug}?limit=${limit}`);
    return res.json();
  },

  // Feed
  async getFeed(page = 1, limit = 20): Promise<Post[]> {
    const res = await fetch(`${API_URL}/feed?page=${page}&limit=${limit}`);
    return res.json();
  },

  async likePost(postId: string, address: string) {
    const res = await fetch(`${API_URL}/feed/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    return res.json();
  },

  // Repost feature removed

  async recordTip(postId: string, data: {
    from: string;
    amount: number;
    txId: string;
  }) {
    const res = await fetch(`${API_URL}/feed/${postId}/tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Auth
  async getNonce(address: string) {
    const res = await fetch(`${API_URL}/auth/nonce?address=${address}`);
    return res.json();
  },

  async verifySignature(data: {
    address: string;
    signature: string;
    publicKey?: string;
  }) {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getProfile(address: string) {
    const res = await fetch(`${API_URL}/auth/profile/${address}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return res.json();
  },

  async updateUsername(address: string, username: string) {
    const res = await fetch(`${API_URL}/auth/profile/${address}/username?t=${Date.now()}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ username })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update username');
    }
    return res.json();
  }
};



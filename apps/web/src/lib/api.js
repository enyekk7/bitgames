const API_URL = import.meta.env.VITE_API_URL || 'https://api-r4ha0h3ep-enyeks-projects-61a9bb1e.vercel.app';

export const api = {
  // Games
  async getGames() {
    const res = await fetch(`${API_URL}/games`);
    return res.json();
  },

  async getGame(slug) {
    const res = await fetch(`${API_URL}/games/${slug}`);
    return res.json();
  },

  async submitScore(slug, data) {
    const res = await fetch(`${API_URL}/games/${slug}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(slug, limit = 10) {
    const res = await fetch(`${API_URL}/leaderboard/${slug}?limit=${limit}`);
    return res.json();
  },

  // Feed
  async getFeed(page = 1, limit = 20) {
    const res = await fetch(`${API_URL}/feed?page=${page}&limit=${limit}`);
    return res.json();
  },

  async likePost(postId, address) {
    const res = await fetch(`${API_URL}/feed/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    return res.json();
  },

  // Repost feature removed

  async recordTip(postId, data) {
    const res = await fetch(`${API_URL}/feed/${postId}/tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Auth
  async getNonce(address) {
    const res = await fetch(`${API_URL}/auth/nonce?address=${address}`);
    return res.json();
  },

  async verifySignature(data) {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getProfile(address) {
    const res = await fetch(`${API_URL}/auth/profile/${address}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return res.json();
  },

  async updateUsername(address, username) {
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

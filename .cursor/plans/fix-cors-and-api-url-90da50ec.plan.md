<!-- 90da50ec-9cc4-48d8-9ec9-6bba32957580 5b0adcba-53da-4907-a2e8-edfa5fe15ddf -->
# Fix API: Convert TypeScript to JavaScript Only

## Scope

**HANYA mengubah API backend** - Frontend, tampilan, dan gameplay TIDAK DIUBAH

## Changes

### 1. Create JavaScript API Files

**File: `api/feed.js`** (NEW)

```javascript
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mockPosts = [
      {
        _id: '1',
        type: 'score',
        author: {
          address: 'ST3RHRNAVPT5ATP2JWJXAB836TV559GPCYCRTVGJR',
          username: 'testuser',
          avatar: null
        },
        content: 'Just scored 100 points in Snake! 🐍',
        game: {
          slug: 'snake',
          name: 'Snake',
          thumbnail: '/games/snake-thumb.png'
        },
        score: 100,
        likes: 5,
        tips: [],
        createdAt: new Date().toISOString()
      }
    ];

    return res.status(200).json(mockPosts);
  } catch (error) {
    console.error('Feed error:', error);
    return res.status(500).json({ error: 'Failed to fetch feed' });
  }
};
```

**File: `api/health.js`** (NEW)

```javascript
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'API is working'
  });
};
```

### 2. Update Vercel Config

Update `vercel.json` line 7-15:

```json
"rewrites": [
  {
    "source": "/api/feed",
    "destination": "/api/feed.js"
  },
  {
    "source": "/api/health",
    "destination": "/api/health.js"
  },
  {
    "source": "/(.*)",
    "destination": "/apps/web/dist/$1"
  }
]
```

### 3. Remove Old TypeScript Files

Delete:

- `api/feed.ts`
- `api/health.ts`

### 4. Deploy

Run `vercel --prod` to deploy

## What WILL Change

- ✅ API endpoints akan bekerja (tidak crash lagi)
- ✅ Feed akan load dengan mock data

## What WILL NOT Change

- ❌ Frontend code (React components)
- ❌ Tampilan UI/UX
- ❌ Gameplay mechanics
- ❌ Games (Snake, Tic-tac-toe, etc)
- ❌ Styling/CSS
- ❌ User experience

Frontend tetap 100% sama, hanya backend API yang diperbaiki!
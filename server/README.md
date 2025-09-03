# FitGenius Backend Proxy Server

This server acts as a secure proxy for OpenAI API calls, keeping your API key safe on the server side.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Updating Frontend

Update your frontend `src/services/openai.js` to use the backend endpoints:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getMealRecommendations(userProfile) {
  const response = await fetch(`${API_URL}/api/meal-recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile })
  });
  return response.json();
}
```

## Deployment

For production:
1. Deploy this server to a platform like Railway, Render, or Heroku
2. Set environment variables on your hosting platform
3. Update frontend VITE_API_URL to point to your deployed server
4. Remove `dangerouslyAllowBrowser` from frontend OpenAI configuration
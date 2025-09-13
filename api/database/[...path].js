// Vercel API Route: Database Proxy to PostgREST
export default async function handler(req, res) {
  const { path } = req.query;
  const table = path[0];
  const id = path[1];
  
  // Allowed tables for security
  const allowedTables = [
    'users', 'progress_entries', 'workouts', 'meals', 
    'weekly_meal_plans', 'workout_sessions', 'grocery_lists'
  ];

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Build PostgREST URL
    const postgrestUrl = process.env.POSTGREST_URL || 'http://localhost:3000';
    let url = `${postgrestUrl}/${table}`;
    
    // Add ID filter if provided
    if (id) {
      url += `?id=eq.${id}`;
    }

    // Add query parameters
    const queryParams = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (!['path'].includes(key)) {
        queryParams.append(key, value);
      }
    });
    
    if (queryParams.toString()) {
      url += (url.includes('?') ? '&' : '?') + queryParams.toString();
    }

    // Forward request to PostgREST
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();

    // Forward PostgREST response
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Database proxy error:', error);
    res.status(500).json({ error: 'Database request failed' });
  }
}
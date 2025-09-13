// Vercel API Route: User Signup
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-minimum-256-bits';

// Database connection
const getClient = () => new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://dominiclewis@localhost:5432/fitgenius'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = getClient();

  try {
    await client.connect();

    const { email, password, profile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM api.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await client.query(`
      INSERT INTO api.users (email, password_hash, profile)
      VALUES ($1, $2, $3)
      RETURNING id, email, profile, created_at
    `, [email, hashedPassword, JSON.stringify(profile || {})]);

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
}
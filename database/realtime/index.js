const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = createServer(app);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Database connection
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://admin:fitgenius_secure_2024@localhost:5432/fitgenius'
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-minimum-256-bits';

// Connect to PostgreSQL
async function connectDB() {
  try {
    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Listen for database notifications
    await pgClient.query('LISTEN fitgenius_changes');
    
    pgClient.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload);
        console.log('📡 Database notification:', payload);
        
        // Broadcast to specific user's room
        if (payload.user_id) {
          io.to(payload.user_id).emit('database_change', {
            table: payload.table,
            action: payload.action,
            data: payload.data
          });
        }
        
        // Broadcast to all connected clients for general updates
        io.emit('global_update', {
          type: payload.table,
          action: payload.action,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error processing notification:', error);
      }
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// JWT Authentication middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.sub || decoded.user_id;
    socket.userEmail = decoded.email;
    console.log(`🔐 User authenticated: ${socket.userEmail} (${socket.userId})`);
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userEmail} (${socket.userId})`);
  
  // Join user-specific room for private updates
  socket.join(socket.userId);
  
  // Join general rooms based on user interests
  socket.join('general');
  
  // Send welcome message with connection info
  socket.emit('connected', {
    message: 'Connected to FitGenius real-time server',
    userId: socket.userId,
    timestamp: new Date().toISOString()
  });
  
  // Handle user-specific subscriptions
  socket.on('subscribe_to_table', (tableName) => {
    const validTables = ['progress_entries', 'workouts', 'meals', 'weekly_meal_plans', 'workout_sessions', 'grocery_lists'];
    
    if (validTables.includes(tableName)) {
      socket.join(`${socket.userId}:${tableName}`);
      console.log(`📊 User ${socket.userEmail} subscribed to ${tableName}`);
      
      socket.emit('subscription_confirmed', {
        table: tableName,
        message: `Subscribed to ${tableName} updates`
      });
    } else {
      socket.emit('subscription_error', {
        message: `Invalid table: ${tableName}`
      });
    }
  });
  
  // Handle manual data refresh requests
  socket.on('request_data_refresh', async (tableName) => {
    try {
      const validTables = ['progress_entries', 'workouts', 'meals', 'weekly_meal_plans', 'workout_sessions', 'grocery_lists'];
      
      if (!validTables.includes(tableName)) {
        socket.emit('data_refresh_error', { message: `Invalid table: ${tableName}` });
        return;
      }
      
      const result = await pgClient.query(
        `SELECT * FROM api.${tableName} WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
        [socket.userId]
      );
      
      socket.emit('data_refresh', {
        table: tableName,
        data: result.rows,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Data refresh error:', error);
      socket.emit('data_refresh_error', { message: 'Failed to refresh data' });
    }
  });
  
  // Handle workout session updates (real-time workout tracking)
  socket.on('workout_progress', (data) => {
    // Broadcast workout progress to user's other devices
    socket.to(socket.userId).emit('workout_progress_update', {
      ...data,
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle meal logging updates
  socket.on('meal_logged', (data) => {
    socket.to(socket.userId).emit('meal_update', {
      ...data,
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`🔌 User disconnected: ${socket.userEmail} (${reason})`);
  });
  
  // Error handling
  socket.on('error', (error) => {
    console.error(`❌ Socket error for user ${socket.userEmail}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
    database: pgClient._connected ? 'connected' : 'disconnected'
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    connected_clients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
    uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 FitGenius Real-time Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  
  io.close(() => {
    console.log('✅ Socket.IO server closed');
  });
  
  await pgClient.end();
  console.log('✅ Database connection closed');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  
  io.close(() => {
    console.log('✅ Socket.IO server closed');
  });
  
  await pgClient.end();
  console.log('✅ Database connection closed');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
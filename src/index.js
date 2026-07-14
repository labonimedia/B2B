// const mongoose = require('mongoose');
// const socketIo = require('socket.io');
// const http = require('http');
// const app = require('./app');
// const config = require('./config/config');
// const logger = require('./config/logger');

// let server = http.createServer(app); // Create HTTP server
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // Allow frontend access
//     methods: ['GET', 'POST'],
//   },
// });

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });

// // Store connected users (Key: userId, Value: socketId)
// const onlineUsers = new Map();

// io.on('connection', (socket) => {
//   console.log(`🔌 User connected: ${socket.id}`);

//   socket.on('register', (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`✅ User ${userId} registered`);
//   });

//   socket.on('disconnect', () => {
//     for (const [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         console.log(`❌ User ${userId} disconnected.`);
//         break;
//       }
//     }
//   });
// });
// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });

// module.exports = { io };

const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const { startSubscriptionExpiryJob } = require('./jobs/subscription.expiry.job');

/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
*/

const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| Socket.IO Configuration
|--------------------------------------------------------------------------
*/

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

/*
|--------------------------------------------------------------------------
| Store Connected Users
|--------------------------------------------------------------------------
|
| Key   : userId
| Value : socketId
|
*/

const onlineUsers = new Map();

/*
|--------------------------------------------------------------------------
| Socket.IO Events
|--------------------------------------------------------------------------
*/

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  /*
  |--------------------------------------------------------------------------
  | Register User
  |--------------------------------------------------------------------------
  */

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);

    logger.info(`User ${userId} registered`);
  });

  /*
  |--------------------------------------------------------------------------
  | Disconnect User
  |--------------------------------------------------------------------------
  */

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);

        logger.info(`User ${userId} disconnected`);

        break;
      }
    }
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | MongoDB Connection
    |--------------------------------------------------------------------------
    */

    await mongoose.connect(config.mongoose.url, config.mongoose.options);

    logger.info('Connected to MongoDB');

    /*
    |--------------------------------------------------------------------------
    | Start Cron Jobs
    |--------------------------------------------------------------------------
    */

    startSubscriptionExpiryJob();

    /*
    |--------------------------------------------------------------------------
    | Start HTTP + Socket.IO Server
    |--------------------------------------------------------------------------
    */

    server.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);

    process.exit(1);
  }
};

startServer();

/*
|--------------------------------------------------------------------------
| Exit Handler
|--------------------------------------------------------------------------
*/

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');

      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| Unexpected Error Handler
|--------------------------------------------------------------------------
*/

const unexpectedErrorHandler = (error) => {
  logger.error(error);

  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);

process.on('unhandledRejection', unexpectedErrorHandler);

/*
|--------------------------------------------------------------------------
| SIGTERM Handler
|--------------------------------------------------------------------------
*/

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');

  if (server) {
    server.close();
  }
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  io,
};

// const { io } = require('../index'); // Import WebSocket server

// // Store connected users (Key: userId, Value: socketId)
// const onlineUsers = new Map();

// // Send real-time notifications
// const sendNotification = async (userId, message) => {
//   if (onlineUsers.has(userId)) {
//     const socketId = onlineUsers.get(userId);
//     io.to(socketId).emit('notification', { message });
//     console.log(`📨 Notification sent to user ${userId}`);
//   } else {
//     console.log(`⚠️ User ${userId} is not online.`);
//   }
// };

// module.exports = { sendNotification, onlineUsers };

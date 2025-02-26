const { sendNotification, onlineUsers } = require('../../src/utils/notification');

describe('WebSocket Notification Tests', () => {
  let mockSocket;

  beforeEach(() => {
    // Mock socket.io
    mockSocket = {
      emit: jest.fn(),
    };
    onlineUsers.set('user123', 'socket123');
  });

  afterEach(() => {
    onlineUsers.clear(); // Reset users after each test
  });

  test('should send notification to an online user', async () => {
    const ioMock = { to: jest.fn().mockReturnValue(mockSocket) };
    require('../../src/index').io = ioMock; // Mock io instance

    await sendNotification('user123', 'Test message');

    expect(ioMock.to).toHaveBeenCalledWith('socket123');
    expect(mockSocket.emit).toHaveBeenCalledWith('notification', { message: 'Test message' });
  });

  test('should not send notification to an offline user', async () => {
    await sendNotification('user456', 'Offline user test');

    // Since user is not online, no WebSocket message should be emitted
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});

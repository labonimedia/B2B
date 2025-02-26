const { autoForwardQueue, autoCancelQueue } = require('../src/queue');
const { MnfDeliveryChallan } = require('../../src/models');
const { sendNotification } = require('../../src/utils/notification');

jest.mock('../src/models'); // Mock the database
jest.mock('../src/utils/notification'); // Mock notification function

describe('Worker Process Tests', () => {
  test('should auto-forward an order', async () => {
    const order = {
      _id: 'order123',
      orderNumber: 'ORD-001',
      status: 'Pending',
      retailerId: 'retailer123',
      save: jest.fn(),
    };

    MnfDeliveryChallan.findById = jest.fn().mockResolvedValue(order);

    await autoForwardQueue.process({
      data: { orderId: 'order123' },
    });

    expect(order.status).toBe('Auto Forwarded');
    expect(order.save).toHaveBeenCalled();
    expect(sendNotification).toHaveBeenCalledWith('retailer123', 'Order ORD-001 has been auto-forwarded.');
  });

  test('should auto-cancel an order', async () => {
    const order = {
      _id: 'order123',
      orderNumber: 'ORD-002',
      status: 'Auto Forwarded',
      retailerId: 'retailer123',
      save: jest.fn(),
    };

    MnfDeliveryChallan.findById = jest.fn().mockResolvedValue(order);

    await autoCancelQueue.process({
      data: { orderId: 'order123' },
    });

    expect(order.status).toBe('Canceled');
    expect(order.save).toHaveBeenCalled();
    expect(sendNotification).toHaveBeenCalledWith('retailer123', 'Order ORD-002 has been automatically canceled.');
  });
});

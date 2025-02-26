const request = require('supertest');
const app = require('../src/app'); // Import your Express app

describe('API Endpoint Tests', () => {
  test('POST /api/orders should create an order', async () => {
    const response = await request(app).post('/api/orders').send({ email: 'test@example.com', poNumber: 'PO12345' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });
});

const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('should return a user', async () => {
    const res = await request(app).get('/api/users/123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('John Doe');
  });

  it('should return 404 if user is not found', async () => {
    const res = await request(app).get('/api/users/456');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('User not found');
  });
});

const request = require('supertest');
const app = require('./index');

describe('JFrog Sample App', () => {
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });

  test('GET /api/data returns grouped product data', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('tools');
    expect(res.body.data).toHaveProperty('electronics');
    expect(res.body.data.tools.count).toBe(2);
  });

  test('POST /api/echo returns the request body', async () => {
    const payload = { message: 'hello jfrog', trial: true };
    const res = await request(app).post('/api/echo').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.echo).toEqual(payload);
  });
});

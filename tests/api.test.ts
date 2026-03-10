import request from 'supertest';
import { app } from '../src/api';

describe('POST /convert', () => {
  it('returns fahrenheit and status for a normal reading', async () => {
    const res = await request(app).post('/convert').send({ celsius: 25 });
    expect(res.status).toBe(200);
    expect(res.body.fahrenheit).toBeCloseTo(77, 1);
    expect(res.body.status).toBe('normal');
  });

  it('returns warning status for elevated temperature', async () => {
    const res = await request(app).post('/convert').send({ celsius: 70 });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('warning');
  });

  it('returns critical status for dangerous temperature', async () => {
    const res = await request(app).post('/convert').send({ celsius: 95 });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('critical');
  });

  it('returns critical status for sub-zero temperature', async () => {
    const res = await request(app).post('/convert').send({ celsius: -10 });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('critical');
  });

  it('returns 400 for non-numeric input', async () => {
    const res = await request(app).post('/convert').send({ celsius: 'hot' });
    expect(res.status).toBe(400);
  });
});

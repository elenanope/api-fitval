import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';

describe('API de FitVal', () => {
  let app: INestApplication;
  let memberToken: string;

  // Antes de todos los tests: arrancamos la API entera
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();
    const email = `test-${Date.now()}@fitval.com`;
    const password = 'password123';

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password });

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password });

    memberToken = (login.body as { accessToken: string }).accessToken;
  });

  // Después de todos: cerramos PostgreSQL y la API (si no, Jest no termina)
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/health responde 200', async () => {
    const response = await request(app.getHttpServer()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'fitval' });
  });

  it('GET /api/classes responde 200 y un array', async () => {
    const response = await request(app.getHttpServer()).get('/api/classes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/classes/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get('/api/classes/abc');
    expect(response.status).toBe(400);
  });

  it('GET /api/classes/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/classes/999999',
    );
    expect(response.status).toBe(404);
  });

  it('POST /api/classes sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/classes')
      .send({});
    expect(response.status).toBe(401);
  });

  it('POST /api/auth/login con contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'noexiste@fitval.com', password: 'malamala123' });
    expect(response.status).toBe(401);
  });

  it('POST /api/classes con token de socio responde 403', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/classes')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({});
    expect(response.status).toBe(403);
  });
});

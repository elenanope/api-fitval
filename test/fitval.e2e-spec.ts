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
      .post('/api/v1/auth/register')
      .send({ email, password });

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password });

    memberToken = (login.body as { accessToken: string }).accessToken;
  });

  // Después de todos: cerramos PostgreSQL y la API (si no, Jest no termina)
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/v1/health responde 200', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'fitval' });
  });

  it('GET /api/v1/classes responde 200 y un array', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/classes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/v1/classes/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/abc',
    );
    expect(response.status).toBe(400);
  });

  it('GET /api/v1/classes/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );
    expect(response.status).toBe(404);
  });

  it('POST /api/v1/classes sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .send({});
    expect(response.status).toBe(401);
  });

  it('POST /api/v1/auth/login con contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'noexiste@fitval.com', password: 'malamala123' });
    expect(response.status).toBe(401);
  });

  it('POST /api/v1/classes con token de socio responde 403', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({});
    expect(response.status).toBe(403);
  });

  it('GET /api/v2/classes?page=1&limit=3 trae 3 clases', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?page=1&limit=3',
    );
    expect(response.status).toBe(200);
    expect((response.body as { data: unknown[] }).data).toHaveLength(3);
  });

  it('GET /api/v2/classes?limit=100 responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?limit=100',
    );
    expect(response.status).toBe(400);
  });

  it('un 404 tiene la forma nueva (path y timestamp)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('path', '/api/v1/classes/999999');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('las respuestas no llevan la cabecera x-powered-by', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('GET /api/v1/trainers/1 responde 200 con sus especialidades', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/trainers/1',
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('specialties', [
      'Ciclo indoor',
      'Fuerza',
    ]);
  });
});

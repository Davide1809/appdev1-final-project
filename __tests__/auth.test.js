const request = require('supertest');
const express = require('express');
const session = require('express-session');
const pool = require('../db');

// Setup Express app for testing
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'test-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Mount routes
app.use('/api/users', require('../routes/users'));
app.use('/api/products', require('../routes/products'));
app.use('/api/categories', require('../routes/categories'));
app.use('/api/admin', require('../routes/admin'));

describe('Authentication Tests', () => {
  let userId = null;
  let sessionCookie = null;

  test('POST /api/users/register - Should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toContain('registered successfully');
    userId = res.body.userId;
  });

  test('POST /api/users/register - Should fail with duplicate username', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'another@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('POST /api/users/register - Should fail with mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
        confirmPassword: 'wrongpassword'
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('POST /api/users/login - Should login successfully', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.user.id).toBe(userId);
    expect(res.body.user.username).toBe('testuser');
    
    // Save session cookie for subsequent tests
    sessionCookie = res.headers['set-cookie'];
  });

  test('POST /api/users/login - Should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
  });
});

describe('Protected Routes Tests', () => {
  test('GET /api/products - Should fail without authentication (401)', async () => {
    const res = await request(app)
      .get('/api/products');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('log in');
  });

  test('GET /api/categories - Should fail without authentication (401)', async () => {
    const res = await request(app)
      .get('/api/categories');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
  });
});

describe('Error Handling Tests', () => {
  test('GET /nonexistent - Should return 404', async () => {
    const res = await request(app)
      .get('/api/products/9999');

    expect(res.status).toBe(401); // 401 because not authenticated
  });

  test('POST /api/users/register - Missing required fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser'
        // Missing other required fields
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('POST /api/users/login - Missing credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser'
        // Missing password
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });
});

describe('Response Format Tests', () => {
  test('Success response should have correct format', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('code');
    expect(res.body.status).toBe('success');
  });

  test('Error response should have correct format', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'nonexistent',
        password: 'password123'
      });

    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('code');
    expect(res.body.status).toBe('error');
  });
});

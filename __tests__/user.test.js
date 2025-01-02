import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../model/userModel.js';

describe('User API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/user/create', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/user/create')
        .send({ name: 'John Doe', email: 'john@example.com', address: '123 Street' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 400 if user already exists', async () => {
      await User.create({ name: 'Jane Doe', email: 'jane@example.com', address: '456 Avenue' });

      const response = await request(app)
        .post('/api/user/create')
        .send({ name: 'Jane Doe', email: 'jane@example.com', address: '456 Avenue' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('User already exists.');
    });
  });

  describe('GET /api/user/getallusers', () => {
    it('should fetch all users', async () => {
      await User.create({ name: 'Alice', email: 'alice@example.com', address: '789 Road' });

      const response = await request(app).get('/api/user/getallusers');

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 404 if no users are found', async () => {
      await User.deleteMany();

      const response = await request(app).get('/api/user/getallusers');

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Users not Found.');
    });
  });

  describe('PUT /api/user/update/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({ name: 'Bob', email: 'bob@example.com', address: '123 Lane' });

      const response = await request(app)
        .put(`/api/user/update/${user._id}`)
        .send({ address: '321 Lane' });

      expect(response.statusCode).toBe(201);
      expect(response.body.address).toBe('321 Lane');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put('/api/user/update/64b5f84e63f49f45678abcd1')
        .send({ address: '321 Lane' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });
  });

  describe('DELETE /api/user/delete/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({ name: 'Charlie', email: 'charlie@example.com', address: '456 Way' });

      const response = await request(app).delete(`/api/user/delete/${user._id}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe(' User deleted Successfully.');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).delete('/api/user/delete/64b5f84e63f49f45678abcd1');

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(' User Not Found. ');
    });
  });
});

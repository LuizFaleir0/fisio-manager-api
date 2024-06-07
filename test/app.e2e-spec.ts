import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/entitys/user.entity';
import { createUserDtoMock } from '../src/users/mocks/mocks';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userCreated: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });
  // Teste para endPoint de buscar usuários
  describe('/users (GET)', () => {
    it('should return status 200', async () => {
      return request(app.getHttpServer()).get('/users').expect(HttpStatus.OK);
    });
  });

  // Teste para endPoint de criar usuário
  describe('/users (POST)', () => {
    // Depende de testes de outros endPoints
    it('should return status 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDtoMock);

      const body: User = response.body;
      userCreated = new User();
      userCreated.uuid = body.uuid;
      userCreated.full_name = body.full_name;
      userCreated.user_name = body.user_name;
      userCreated.phone = body.phone;
      userCreated.is_active = body.is_active;
      userCreated.created_at = body.created_at;
      userCreated.updated_at = body.updated_at;
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it('should return status 422', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDtoMock);

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  // Teste para endPoint de buscar usuário por uuid
  describe('/users/user (GET)', () => {
    it('should return status 200', () => {
      return request(app.getHttpServer())
        .get(`/users/user?uuid=${userCreated.uuid}`)
        .expect(HttpStatus.OK);
    });

    it('should return status 400', () => {
      return request(app.getHttpServer())
        .get('/users/user')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  // Teste para endPoint de deletar usuário
  describe('/users (DELETE)', () => {
    it('should return status 200', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/users/user?uuid=${userCreated.uuid}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });
});

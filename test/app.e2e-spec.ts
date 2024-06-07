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
    it.skip('should return status 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDtoMock);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });
  });

  // Teste para endPoint de buscar usuário por uuid
  describe('/users/user (GET)', () => {
    it('should return status 200', () => {
      const uuid = userCreated.uuid;
      return request(app.getHttpServer())
        .get(`/users/user?uuid=${uuid}`)
        .expect(HttpStatus.OK);
    });

    it('should return status 400', () => {
      return request(app.getHttpServer())
        .get('/users/user')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});

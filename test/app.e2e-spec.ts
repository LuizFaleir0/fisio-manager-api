import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
      .expect(200)
      .expect('Hello World!');
  });
  // Teste para endPoint de buscar usuários
  describe('/users (GET)', () => {
    it('should return status 200', async () => {
      return request(app.getHttpServer()).get('/users').expect(200);
    });
  });

  // Teste para endPoint de buscar usuário por uuid
  describe('/users/user (GET)', () => {
    it('should return status 200', () => {
      const uuid = 'e598d835-5f4c-42f3-85ba-2bfe21f6e777';
      return request(app.getHttpServer())
        .get(`/users/user?uuid=${uuid}`)
        .expect(200);
    });

    it('should return status 400', () => {
      return request(app.getHttpServer()).get('/users/user').expect(400);
    });
  });
});

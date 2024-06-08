import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/entitys/user.entity';
import {
  createUserDtoMock,
  createUserDtoMockTwo,
  updateUserDtoMock,
  updateUserNameMock,
} from '../src/users/mocks/mocks';
import { UpdateUserDto } from '../src/users/dtos/update-user.dto';
import { UpdateUserNameDto } from 'src/users/dtos/update-user-name.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userCreated: User;
  let userCreatedTwo: User;

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

      const responseTwo = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDtoMockTwo);

      // Body da resposta
      const body: User = response.body;
      const bodyTwo: User = responseTwo.body;

      // Salva o usuário criado
      userCreated = new User();
      userCreated.uuid = body.uuid;
      userCreated.full_name = body.full_name;
      console.log('POST', body);
      userCreated.user_name = body.user_name;
      userCreated.phone = body.phone;
      userCreated.is_active = body.is_active;
      userCreated.created_at = body.created_at;
      userCreated.updated_at = body.updated_at;

      // Salva o segundo usuário criado
      userCreatedTwo = new User();
      userCreatedTwo.uuid = bodyTwo.uuid;
      userCreatedTwo.full_name = bodyTwo.full_name;
      userCreatedTwo.user_name = bodyTwo.user_name;
      userCreatedTwo.phone = bodyTwo.phone;
      userCreatedTwo.is_active = bodyTwo.is_active;
      userCreatedTwo.created_at = bodyTwo.created_at;
      userCreatedTwo.updated_at = bodyTwo.updated_at;

      // Verifica se o status recebido é 201
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

  // Teste para endPoint de atualizar dados de usuário por uuid
  describe('/users/user (PUT)', () => {
    it('should return status 200', async () => {
      const body: UpdateUserDto = {
        uuid: userCreated.uuid,
        user: updateUserDtoMock.user,
      };
      const response = await request(app.getHttpServer())
        .put('/users/user')
        .send(body);

      // Verifica se o status recebido é 200
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should return status 404', async () => {
      const body: UpdateUserDto = {
        uuid: 'uuid',
        user: updateUserDtoMock.user,
      };
      const response = await request(app.getHttpServer())
        .put('/users/user')
        .send(body);

      // Verifica se o status recebido é 404
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return status 400', async () => {
      // Body com uuid e sem dados do usuário
      const bodyWithoutUserData: Partial<UpdateUserDto> = {
        uuid: userCreated.uuid,
      };

      // Body com dados do usuário e sem uuid
      const bodyWithoutUUID: Partial<UpdateUserDto> = {
        user: userCreated,
      };
      const responseWithoutUserData = await request(app.getHttpServer())
        .put('/users/user')
        .send(bodyWithoutUserData);

      const responseWithoutUUID = await request(app.getHttpServer())
        .put('/users/user')
        .send(bodyWithoutUUID);

      // Verifica se o status de cada requisição recebido é 400
      expect(responseWithoutUserData.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(responseWithoutUUID.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  // Teste para endPoint de atualizar nome de usuário por uuid
  describe('/users/user_name (PATCH)', () => {
    it('should return status 200', async () => {
      const body: UpdateUserNameDto = {
        uuid: userCreated.uuid,
        user_name: updateUserNameMock.user_name,
      };
      const response = await request(app.getHttpServer())
        .patch('/users/user_name')
        .send(body);

      const responseBody: UpdateUserNameDto = response.body;

      userCreated.user_name = responseBody.user_name;

      // Verifica se o status recebido é 200
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should return status 404', async () => {
      const body: UpdateUserNameDto = {
        uuid: 'uuid',
        user_name: updateUserNameMock.user_name,
      };
      const response = await request(app.getHttpServer())
        .patch('/users/user_name')
        .send(body);

      // Verifica se o status recebido é 404
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return status 400', async () => {
      // Body com uuid e sem o nome de usuário
      const bodyWithoutUserName: Partial<UpdateUserDto> = {
        uuid: userCreated.uuid,
      };

      // Body com o nome de usuário e sem uuid
      const bodyWithoutUUID: Partial<UpdateUserNameDto> = {
        user_name: updateUserNameMock.user_name,
      };
      const responseWithoutUserData = await request(app.getHttpServer())
        .patch('/users/user_name')
        .send(bodyWithoutUserName);

      const responseWithoutUUID = await request(app.getHttpServer())
        .patch('/users/user_name')
        .send(bodyWithoutUUID);

      // Verifica se o status de cada requisição recebido é 400
      expect(responseWithoutUserData.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(responseWithoutUUID.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    describe('should return status 422', () => {
      it('There is an account with the same username', async () => {
        // Body com uuid do userCreated e o nome de usuário do userCreatedTwo
        const body: Partial<UpdateUserNameDto> = {
          uuid: userCreated.uuid,
          user_name: userCreatedTwo.user_name,
        };

        const response = await request(app.getHttpServer())
          .patch('/users/user_name')
          .send(body);

        console.log(response.body);
        // Verifica se o status de cada requisição recebido é 422
        expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it('The account already uses this username', async () => {
        // Body com uuid e o nome de usuário do userCreated
        const body: Partial<UpdateUserNameDto> = {
          uuid: userCreated.uuid,
          user_name: userCreated.user_name,
        };

        const response = await request(app.getHttpServer())
          .patch('/users/user_name')
          .send(body);

        console.log(response.body);

        // Verifica se o status de cada requisição recebido é 422
        expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  // Teste para endPoint de deletar usuário
  describe('/users (DELETE)', () => {
    it('should return status 200', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/users/user?uuid=${userCreated.uuid}`,
      );

      // Verifica se o status recebido é 200
      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });
});

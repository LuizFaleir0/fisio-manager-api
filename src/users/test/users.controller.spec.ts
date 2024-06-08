import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import {
  createUserDtoMock,
  createUserResponseMock,
  updateUserDtoMock,
  updateUserNameMock,
  updateUserNameResponseMock,
  updateUserResponseMock,
  usersMock,
} from '../mocks/mocks';
import { CPaginateDefault } from '../../constants';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            /**
             * Mock de Buscar usuários
             */
            findAll: jest.fn().mockResolvedValue(usersMock),
            /**
             * Mock de Buscar usuário
             */
            findByUUID: jest.fn().mockResolvedValue(usersMock[0]),
            /**
             * mock de Criar um novo usuário
             */
            create: jest.fn().mockResolvedValue(createUserResponseMock),
            /**
             * mock de Atualizar um usuário
             */
            update: jest.fn().mockResolvedValue(updateUserResponseMock),
            /**
            /**
             * mock de Atualizar o nome de usuário
             */
            changeUserName: jest
              .fn()
              .mockResolvedValue(updateUserNameResponseMock),
            /**
             * Mock de Deletar um usuário
             */
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  // Verifica se o controlador de rotas de usuários foi definido
  it.skip('usersController should be defined', () => {
    expect(usersController).toBeDefined();
  });

  // Verifica se o serviço de usuários foi definido
  it.skip('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // Teste para método findAll
  describe.skip('findAll', () => {
    it('should return an array of users', async () => {
      // Chama o método findAll
      const result = await usersController.findAll('', CPaginateDefault);

      // Verifica se o resultado é igual ao Mock
      expect(result).toEqual(usersMock);
    });

    it('should rejects with Error', async () => {
      // Simula o retorno do método findAll do serviço de usuários
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new Error());
      // Verifica se o método findAll retorna um erro
      await expect(
        usersController.findAll('', CPaginateDefault),
      ).rejects.toThrow(Error);
    });
  });
  // Teste para método findByUUID
  describe.skip('findByUUID', () => {
    it('should return an user', async () => {
      // Chama o método findByUUID
      const result = await usersController.findByUUID('uuid');

      // Verifica se o resultado é igual ao Mock
      expect(result).toEqual(usersMock[0]);
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método findByUUID do serviço de usuários
      jest
        .spyOn(usersService, 'findByUUID')
        .mockRejectedValue(new NotFoundException());

      // Verifica se o método findByUUID retorna um NotFoundException
      await expect(usersController.findByUUID('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe.skip('create', () => {
    it('should return an user', async () => {
      // Chama o método create do controlador de rotas
      const result = await usersController.create(createUserDtoMock);

      // Verifica se o resultado é igual ao mock
      expect(result).toEqual(createUserResponseMock);
    });

    it('should rejects with UnprocessableEntityException', async () => {
      // Simula o retorno do método create do serviço de usuários
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new UnprocessableEntityException());

      // Verificando se o método create retorna um UnprocessableEntityException
      await expect(usersController.create(createUserDtoMock)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe.skip('update', () => {
    it('should return an user', async () => {
      // Chama o método update do controlador de rotas
      const result = await usersController.update(updateUserDtoMock);

      // Verifica se o resultado é igual ao mock
      expect(result).toEqual(updateUserResponseMock);
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método delete do serviço de usuários
      jest
        .spyOn(usersService, 'update')
        .mockRejectedValue(new NotFoundException());
      // Verifica se o método retorna NotFoundException
      await expect(usersController.update(updateUserDtoMock)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('changeUserName', () => {
    it('should return an user', async () => {
      // Chama o método changeUserName do controlador de rotas
      const result = await usersController.changeUserName(updateUserNameMock);

      // Verifica se o resultado é igual ao mock
      expect(result).toEqual(updateUserNameResponseMock);
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método delete do serviço de usuários
      jest
        .spyOn(usersService, 'changeUserName')
        .mockRejectedValue(new NotFoundException());
      // Verifica se o método retorna NotFoundException
      await expect(
        usersController.changeUserName(updateUserNameMock),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe.skip('delete', () => {
    it('should return an object with true deleted property', async () => {
      // Chama o método delete do controlador de rotas
      const result = await usersController.delete('uuid');

      // Verifica se o resultado é um objeto com a propriedade deleted true
      expect(result).toEqual({ deleted: true });
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método delete do serviço de usuários
      jest
        .spyOn(usersService, 'delete')
        .mockRejectedValue(new NotFoundException());
      // Verifica se o método retorna NotFoundException
      await expect(usersController.delete('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

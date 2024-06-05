import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { usersMock } from '../mocks/mocks';
import { CPaginateDefault } from '../../constants';
import { NotFoundException } from '@nestjs/common';

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
             * Busca usuários
             */
            findAll: jest.fn().mockResolvedValue(usersMock),
            /**
             * Busca usuário
             */
            findByUUID: jest.fn().mockResolvedValue(usersMock[0]),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  // Verifica se o controlador de rotas de usuários foi definido
  it('usersController should be defined', () => {
    expect(usersController).toBeDefined();
  });

  // Verifica se o serviço de usuários foi definido
  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // Teste para método findAll
  describe('findAll', () => {
    it('should return un array of users', async () => {
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

    // Teste para método findByUUID
    describe('findByUUID', () => {
      it('should return un user', async () => {
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
  });
});

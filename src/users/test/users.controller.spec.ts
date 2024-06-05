import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { usersMock } from '../mocks/mocks';
import { CPaginateDefault } from '../../constants';

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
            findAll: jest.fn().mockResolvedValue(usersMock),
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

  // Teste para método findAll do controlador de rotas de usuários
  describe('findAll', () => {
    it('should return un array of users', async () => {
      // Chama o método findAll do controlador de rotas de usuários
      const result = await usersController.findAll('', CPaginateDefault);

      // Verifica se o resultado é igual ao Mock
      expect(result).toEqual(usersMock);
    });

    it('should rejects with Error', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new Error());
      // Verifica se o método findAll retorna um erro
      await expect(
        usersController.findAll('', CPaginateDefault),
      ).rejects.toThrow(Error);
    });
  });
});

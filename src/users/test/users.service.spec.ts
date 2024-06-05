import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entitys/user.entity';
import { Repository } from 'typeorm';
import { usersMock } from '../mocks/mocks';
import { CPaginateDefault } from 'src/constants';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            /**
             * Mock de Buscar usuários
             */
            find: jest.fn(),
            /**
             * Mock de construtor de Query
             */
            createQueryBuilder: jest.fn().mockReturnValue({
              /**
               * Mock de parâmetro where de construtor de Query
               */
              where: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro ilike de construtor de Query
               */
              ilike: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro orderBy de construtor de Query
               */
              orderBy: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro limit de construtor de Query
               */
              limit: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro skip de construtor de Query
               */
              skip: jest.fn().mockReturnThis(),
              /**
               * Mock de metódo getMany do construtor de Query
               */
              getMany: jest.fn().mockResolvedValue(usersMock),
            }),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  // Verifica se o serviço de usuários foi definido
  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // Verifica se o repositório de usuários foi definido
  it('usersRepository should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  // Teste para método findAll do serviço de usuários
  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Chama o método findAll do serviço de usuários
      const result = await usersService.findAll('search', CPaginateDefault);

      // Verifica se o resultado é igual o Mock
      expect(result).toEqual(usersMock);
    });

    it('should rejects with Error', async () => {
      // Simula o retorno do método getMany do createQueryBuilder do repositório
      jest
        .spyOn(usersRepository.createQueryBuilder(), 'getMany')
        .mockRejectedValue(new Error());

      // Verifica se o método findAll retorna um erro
      await expect(
        usersService.findAll('search', CPaginateDefault),
      ).rejects.toThrow(Error);
    });
  });
});

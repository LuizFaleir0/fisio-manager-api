import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entitys/user.entity';
import { Repository } from 'typeorm';
import {
  createUserDtoMock,
  createUserResponseMock,
  updateUserDtoMock,
  updateUserResponseMock,
  usersMock,
} from '../mocks/mocks';
import { CPaginateDefault } from '../../constants';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

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
             * Mock de Buscar usuário
             */
            findOne: jest.fn().mockResolvedValue(usersMock[0]),
            /**
             * Mock de Buscar usuário por uuid
             */
            findOneBy: jest.fn().mockResolvedValue(usersMock[0]),
            /**
             * Mock de Verificar se existe um usuário com dados específicos
             */
            existsBy: jest.fn().mockResolvedValue(false),
            /**
             * Mock de Salvar dados de um usuário
             */
            save: jest.fn().mockResolvedValue(createUserResponseMock),
            /**
             * Mock de Deletar usuário
             */
            delete: jest.fn().mockResolvedValue(true),
            /**
             * Mock de construtor de Query
             */
            createQueryBuilder: jest.fn().mockReturnValue({
              /**
               * Mock de parâmetro select de construtor de Query
               */
              select: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro where de construtor de Query
               */
              where: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro orWhere de construtor de Query
               */
              orWhere: jest.fn().mockReturnThis(),
              /**
               * Mock de parâmetro andWhere de construtor de Query
               */
              andWhere: jest.fn().mockReturnThis(),
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
  it.skip('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // Verifica se o repositório de usuários foi definido
  it.skip('usersRepository should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  // Teste para método findAll do serviço de usuários
  describe.skip('findAll', () => {
    it('should return an array of users', async () => {
      // Chama o método findAll do serviço de usuários
      const result = await usersService.findAll(
        'search',
        CPaginateDefault,
        true,
      );

      // Verifica se o resultado é igual o Mock
      expect(result).toEqual(usersMock);
    });

    it('should rejects with Error', async () => {
      // Simula o retorno do método getMany do createQueryBuilder do repositório de usuários
      jest
        .spyOn(usersRepository.createQueryBuilder(), 'getMany')
        .mockRejectedValue(new Error());

      // Verifica se o método findAll retorna um erro
      await expect(
        usersService.findAll('search', CPaginateDefault),
      ).rejects.toThrow(Error);
    });
  });

  // Teste para método findByUUID do serviço de usuários
  describe.skip('findByUUID', () => {
    it('should return an user', async () => {
      // Chama o método findAll do serviço de usuários
      const result = await usersService.findByUUID('uuid');

      // Verifica se o resultado é igual o Mock
      expect(result).toEqual(usersMock[0]);
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método findOne do repositório de usuários
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      // Verifica se o método findByUUID retorna um NotFoundException
      await expect(usersService.findByUUID('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe.skip('create', () => {
    it('should return an user', async () => {
      // Chama o método create do serviço de usuários
      const result = await usersService.create(createUserDtoMock);

      // Verifica se o resultado é igual ao mock
      expect(result).toEqual(createUserResponseMock);
    });

    it('should rejects with UnprocessableEntityException', async () => {
      // Simula o retorno do método existsBy do repositório de usuários
      jest.spyOn(usersRepository, 'existsBy').mockResolvedValue(true);

      // Verifica se o método create retorna um UnprocessableEntityException
      await expect(usersService.create(createUserDtoMock)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('update', () => {
    it('should return un user', async () => {
      // Simula o retorno do método save do repositório de usuários
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(updateUserResponseMock);

      // Chama o método update do serviço de usuários
      const result = await usersService.update(updateUserDtoMock);

      // Verifica se o resultado é igual o Mock
      expect(result).toEqual(updateUserResponseMock);
    });

    it('should rejects with NotFoundException', async () => {
      // Simula o retorno do método findOneBy do repositório de usuários
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      // Verifica se o método update retorna um NotFoundException
      await expect(usersService.update(updateUserDtoMock)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe.skip('delete', () => {
    it('should return un object with true deleted property', async () => {
      // Simula o retorno do método existsBy do repositório de usuários
      jest.spyOn(usersRepository, 'existsBy').mockResolvedValue(true);

      // Chama o método delete do serviço de usuários
      const result = await usersService.delete('uuid');

      // Verifica se o resultado é um objeto com a propriedade deleted true
      expect(result).toEqual({ deleted: true });
    });

    it('should rejects with NotFoundException', async () => {
      // Verifica se o método retorna NotFoundException
      await expect(usersService.delete('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

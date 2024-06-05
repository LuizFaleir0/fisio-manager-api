import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

/**
 * Select Padrão de Busca de Usuário
 */
const selectUserDefault: FindOptionsSelect<User> = {
  uuid: true,
  full_name: true,
  phone: true,
  password: false,
  is_active: true,
  created_at: true,
  updated_at: true,
};

/**
 * Contrato de serviço de usuários.
 */
export interface IUsersService {
  // Retorna uma promesa de um array usuários
  findAll(
    search: string,
    paginate: TPaginate,
    isActive?: boolean,
  ): Promise<User[]>;
  // Retorna uma promesa de um usuário
  findByUUID(uuid: string): Promise<User>;
}

/**
 * Serviço de usuários
 */
@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Buscar Usuários
   * @param search Valor usado para buscar usuários
   * @param paginate Paginação usada ao buscar usuários
   * @param isActive Declara o tipo de situação de usuários a serem buscados
   * @returns
   */
  async findAll(
    search: string,
    paginate: TPaginate,
    isActive?: boolean,
  ): Promise<User[]> {
    try {
      // Define as opções de campos a serem buscados
      const whereOptions: FindOptionsWhere<User> = {
        full_name: `%${search}%`,
        phone: `%${search}%`,
      };

      // Define quantas linhas devem ser ignoradas ao buscar os usuários
      const skip = (paginate.currentPage - 1) * paginate.limit;

      // Verifica se o parâmetro de busca is_active deve ser usado
      if (isActive !== undefined) {
        whereOptions.is_active = isActive;
      }

      // Busca usuários paginados
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.uuid',
          'user.full_name',
          'user.phone',
          'user.is_active',
          'user.created_at',
          'user.updated_at',
        ])
        .where('user.full_name ilike :search', { search: `%${search}%` })
        .orWhere('user.phone ilike :search', { search: `%${search}%` })
        .limit(paginate.limit)
        .skip(skip)
        .getMany();

      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca usuário por uuid
   * @param uuid uuid a ser utilizado
   * @returns Uma promesa de um usuário
   */
  async findByUUID(uuid: string): Promise<User> {
    try {
      if (!uuid) {
        throw new BadRequestException('O parâmetro uuid é requerido!');
      }
      // Busca usuário
      const user = await this.usersRepository.findOne({
        where: {
          uuid: uuid,
        },

        select: selectUserDefault,
      });

      if (user === null) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

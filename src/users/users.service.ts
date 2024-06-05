import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { FindOptionsWhere, Repository } from 'typeorm';

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

      console.log(search);

      // Busca usuários paginados
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.full_name ilike :search', { search: `%${search}%` })
        .limit(paginate.limit)
        .skip(skip)
        .getMany();

      return users;
    } catch (error) {
      throw error;
    }
  }
}

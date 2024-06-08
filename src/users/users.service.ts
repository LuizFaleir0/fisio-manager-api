import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { v4 } from 'uuid';
import { selectUserDefault } from '../constants';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserNameDto } from './dtos/update-user-name.dto';

/**
 * Select Padrão de Usuário (QueryBuilder)
 */
const selectUserDefaultQueryBuilder: string[] = [
  'user.uuid',
  'user.full_name',
  'user.user_name',
  'user.phone',
  'user.is_active',
  'user.created_at',
  'user.updated_at',
];

/**
 * Contrato de serviço de usuários.
 */
export interface IUsersService {
  /**
   * Retorna uma promesa de um array de usuários
   */
  findAll(
    search: string,
    paginate: TPaginate,
    isActive?: boolean,
  ): Promise<User[]>;
  /**
   * Retorna uma promesa de um usuário
   */
  findByUUID(uuid: string): Promise<User>;
  /**
   * Retorna uma promesa de um usuário
   */
  create(createUserDto: CreateUserDto): Promise<Partial<User>>;
  /**
   * Retorna uma promesa de um usuário
   */
  update(updateUserDto: UpdateUserDto): Promise<Partial<User>>;
  /**
   * Retorna uma promesa de um usuário
   */
  changeUserName(updateUserNameDto: UpdateUserNameDto): Promise<Partial<User>>;
  /**
   * Retorna uma promesa de um boolean
   */
  delete(uuid: string): Promise<{ deleted: boolean }>;
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
      // Definindo quantas linhas devem ser ignoradas ao buscar os usuários
      const skip = (paginate.currentPage - 1) * paginate.limit;

      // Definindo construtor de consulta
      const users = this.usersRepository
        .createQueryBuilder('user')
        .select(selectUserDefaultQueryBuilder)
        .where('user.full_name ilike :search', { search: `%${search}%` })
        .orWhere('user.user_name ilike :search', { search: `%${search}%` })
        .orWhere('user.phone ilike :search', { search: `%${search}%` });

      if (isActive !== undefined) {
        users.andWhere('user.is_active = :active', { active: isActive });
      }

      // Definindo paginação
      users.limit(paginate.limit).skip(skip);

      // Busca usuários paginados
      return await users.getMany();
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
      // Verifica se o parâmetro existe
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

      // Verifica se algum usuário foi encontrado
      if (user === null) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria novo usuário
   * @param userCreate Dados do usuário
   * @returns Uma promesa de um usuário
   */
  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      // Verifica se o usuário existe no banco de dados
      const existsUserWithUserName = await this.usersRepository.existsBy({
        user_name: createUserDto.user_name,
      });

      if (existsUserWithUserName) {
        throw new UnprocessableEntityException(
          'Já existe uma conta com esse nome de usuário!',
        );
      }
      // Intanciando novo usuário
      const user = new User();

      // Definindo os dados
      user.uuid = v4();
      user.full_name = createUserDto.full_name;
      user.user_name = createUserDto.user_name;
      if (createUserDto.phone !== undefined) {
        user.phone = createUserDto.phone;
      }
      user.password = createUserDto.password;

      // Salvando usuário no banco de dados
      const savedUser = await this.usersRepository.save(user);

      // Retirando a senha da resposta
      delete savedUser.password;

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      // Verifica se o usuário existe no banco de dados
      const user = await this.usersRepository.findOneBy({
        uuid: updateUserDto.uuid,
      });

      if (user === null) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      // Verifica se o nome completo vai ser alterado
      if (updateUserDto.user.full_name) {
        user.full_name = updateUserDto.user.full_name;
      }

      // Verifica se o telefone vai ser alterado
      if (updateUserDto.user.phone) {
        user.phone = updateUserDto.user.phone;
      }

      // Atualiza dados do usuário
      const userUpdated = await this.usersRepository.save(user);

      // Retira a senha da resposta
      delete userUpdated.password;
      return userUpdated;
    } catch (error) {
      throw error;
    }
  }

  async changeUserName(
    updateUserNameDto: UpdateUserNameDto,
  ): Promise<Partial<User>> {
    try {
      // Verifica se o usuário existe no banco de dados
      const user = await this.usersRepository.findOne({
        where: {
          uuid: updateUserNameDto.uuid,
        },
      });

      if (user === null) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      // Verifica se já existe uma conta com o mesmo nome de usuário
      const existsUserWithUserName = await this.usersRepository.findOneBy({
        user_name: updateUserNameDto.user_name,
      });

      if (existsUserWithUserName !== null) {
        if (existsUserWithUserName.uuid === updateUserNameDto.uuid) {
          throw new UnprocessableEntityException(
            'Você já está utilizando esse nome de usuário!',
          );
        } else {
          throw new UnprocessableEntityException(
            'Já existe uma conta com esse nome de usuário!',
          );
        }
      }

      // Atualiza o Nome de Usuário
      user.user_name = updateUserNameDto.user_name;
      const userUpdated = await this.usersRepository.save(user);

      return userUpdated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deleta usuário do banco de dados
   * @param uuid uuid a ser usado
   * @returns Uma promesa de um boolean
   */
  async delete(uuid: string): Promise<{ deleted: boolean }> {
    try {
      // Verifica se o parâmetro existe
      if (!uuid) {
        throw new BadRequestException('O parâmetro uuid é requerido!');
      }
      // Verifica se o usuário existe no banco de dados
      const existsUserWithUUID = await this.usersRepository.existsBy({
        uuid: uuid,
      });

      if (existsUserWithUUID === false) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      // Deleta o usuário do banco de dados
      await this.usersRepository.delete({
        uuid: uuid,
      });

      return {
        deleted: true,
      };
    } catch (error) {
      throw error;
    }
  }
}

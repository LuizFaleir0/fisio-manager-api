import { Controller, Get, HttpCode, Inject, Query } from '@nestjs/common';
import { IUsersService, UsersService } from './users.service';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { CPaginateDefault } from '../constants';

/**
 * Contrato de controlador de usuário
 */
interface IUsersController {
  findAll(
    search: string,
    paginate: TPaginate,
    isActive: boolean,
  ): Promise<User[]>;
}

/**
 * Controlador de Rota de Usuários
 */
@Controller('users')
export class UsersController implements IUsersController {
  constructor(
    @Inject(UsersService)
    private userService: IUsersService,
  ) {}

  /**
   * Buscar usuários
   * @param search Valor usado para buscar usuários
   * @param paginate Paginação usada ao buscar usuários
   * @param isActive Declara o tipo de situação de usuários a serem buscados
   * @returns Uma promesa de um array de usuários
   */
  @HttpCode(200)
  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('paginate') paginate: TPaginate,
    @Query('isActive') isActive?: boolean,
  ): Promise<User[]> {
    // Definindo os parâmentros padrões de paginação
    const paginateDefault: TPaginate = {
      currentPage: CPaginateDefault.currentPage,
      limit: CPaginateDefault.limit,
    };

    // Verificando se existe parâmetro de busca e definindo valor
    const searchDefault = search ? search : '';

    // Verificando se existe parâmetros de paginação
    if (paginate && paginate.currentPage) {
      paginateDefault.currentPage = paginate.currentPage;
    }

    if (paginate && paginate.limit) {
      paginateDefault.limit = paginate.limit;
    }
    return await this.userService.findAll(
      searchDefault,
      paginateDefault,
      isActive,
    );
  }
}

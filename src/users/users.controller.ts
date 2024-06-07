import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IUsersService, UsersService } from './users.service';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { CPaginateDefault } from '../constants';
import { CreateUserDto } from './dtos/create-user.dto';

/**
 * Contrato de controlador de usuário
 */
interface IUsersController {
  findAll(
    search: string,
    paginate: TPaginate,
    isActive: boolean,
  ): Promise<User[]>;
  findByUUID(uuid: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<Partial<User>>;
  delete(uuid: string): Promise<{ deleted: boolean }>;
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
  @Get()
  @HttpCode(HttpStatus.OK)
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

  /**
   * Buscar usuário por uuid
   * @param uuid uuid a ser utilizado
   * @returns Uma promesa de um usuário
   */
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async findByUUID(@Query('uuid') uuid: string): Promise<User> {
    return await this.userService.findByUUID(uuid);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.create(createUserDto);
  }

  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async delete(@Query('uuid') uuid: string): Promise<{ deleted: boolean }> {
    return await this.userService.delete(uuid);
  }
}

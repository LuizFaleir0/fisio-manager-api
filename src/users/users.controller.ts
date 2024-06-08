import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IUsersService, UsersService } from './users.service';
import { User } from '../entitys/user.entity';
import { TPaginate } from '../interfaces';
import { CPaginateDefault } from '../constants';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserNameDto } from './dtos/update-user-name.dto';

/**
 * Contrato de controlador de usuário
 */
interface IUsersController {
  /**
   * Retorna uma Promesa de um array de usuários
   */
  findAll(
    search: string,
    paginate: TPaginate,
    isActive: boolean,
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
   * Retorna uma promesa de objeto
   */
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

  /**
   * Cria um novo usuário
   * @param createUserDto usuário a ser criado
   * @returns Uma promesa de um usuário
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.create(createUserDto);
  }

  /**
   * Atualiza dados gerais de um usuário
   * @param updateUserDto uuid e dados de usuário a serem atualizados
   * @returns Uma promesa de um usuário
   */
  @Put('user')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body() updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    return await this.userService.update(updateUserDto);
  }

  /**
   * Atualiza nome de usuário de uma conta
   * @param updateUserNameDto Nome de usuário a ser atualizado
   * @returns Uma promesa de um usuário
   */
  @Patch('user_name')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async changeUserName(
    @Body() updateUserNameDto: UpdateUserNameDto,
  ): Promise<Partial<User>> {
    return await this.userService.changeUserName(updateUserNameDto);
  }

  /**
   * Deleta um usuário
   * @param uuid identificador do usuário
   * @returns Uma promesa de um objeto de confirmação com a propriedade deleted
   */
  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async delete(@Query('uuid') uuid: string): Promise<{ deleted: boolean }> {
    return await this.userService.delete(uuid);
  }
}

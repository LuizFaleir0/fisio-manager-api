import { v4 } from 'uuid';
import { User } from '../../entitys/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

/**
 * Mock de array de usuários
 */
export const usersMock = [new User(), new User()];

/**
 * Mock de criação de usuário (Dto)
 */
export const createUserDtoMock: CreateUserDto = {
  full_name: 'nome completo',
  user_name: 'nome de usuario',
  phone: 'telefone',
  password: 'senha',
  password_confirmation: 'senha',
};

/**
 * Mock de atualização de usuário (Dto)
 */
export const updateUserDtoMock: UpdateUserDto = {
  uuid: 'uuid',
  user: {
    full_name: 'nome completo 2',
    phone: 'telefone 2',
  },
};

/**
 * Mock de resposta criação de usuário (Dto)
 */
export const createUserResponseMock: User = {
  uuid: v4(),
  full_name: 'nome completo',
  user_name: 'nome de usuario',
  phone: 'telefone',
  is_active: true,
  created_at: new Date(Date.now()),
  password: 'senha',
  updated_at: new Date(Date.now()),
};

/**
 * Mock de resposta atualização de usuário (Dto)
 */
export const updateUserResponseMock: User = {
  uuid: v4(),
  full_name: 'nome completo 2',
  user_name: 'nome de usuario',
  phone: 'telefone 2',
  is_active: true,
  created_at: new Date(Date.now()),
  password: 'senha',
  updated_at: new Date(Date.now()),
};

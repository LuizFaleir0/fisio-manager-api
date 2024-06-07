import { FindOptionsSelect } from 'typeorm';
import { TPaginate } from './interfaces';
import { User } from './entitys/user.entity';

/**
 * Paginação Padrão
 */
export const CPaginateDefault: TPaginate = { currentPage: 1, limit: 15 };

/**
 * Select Padrão de Usuário
 */
export const selectUserDefault: FindOptionsSelect<User> = {
  uuid: true,
  full_name: true,
  user_name: true,
  phone: true,
  password: false,
  is_active: true,
  created_at: true,
  updated_at: true,
};

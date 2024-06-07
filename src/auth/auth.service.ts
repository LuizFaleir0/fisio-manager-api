import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
 * Contrato de serviço de usuários.
 */
export interface IAuthService {
  // Retorna uma promesa de um usuário e de um token
  // signIn(
  //   user_name: string,
  //   password: string,
  // ): Promise<{ user: Partial<User>; acessToken: string }>;
}

/**
 * Serviço de Autenticação
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // Faz login e gera um token
  // async signIn(
  //   user_name: string,
  //   password: string,
  // ): Promise<{ user: Partial<User>; acessToken: string }> {
  //   try {
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

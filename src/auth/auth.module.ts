import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Configura opções de criação de token
const signOptions: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    global: true,
    privateKey: configService.get<string>('JWT_PRIVATE_KEY_BASE64'),
    publicKey: configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXP'),
      algorithm: 'RS256',
    },
  }),
  inject: [ConfigService],
};

/**
 * Módulo de Autenticação
 * @description Esse módulo é responsável pela autenticação de usuários.
 */
@Module({
  imports: [UsersModule, JwtModule.registerAsync(signOptions)],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

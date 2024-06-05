import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { UsersController } from './users.controller';

/**
 * Módulo de Usuários
 * @description Esse módulo é responsável pelo gerenciamento de usuários.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

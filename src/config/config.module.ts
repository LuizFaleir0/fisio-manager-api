import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { UsersMigration } from '../migrations/1717479839609-users';

/**
 * Configurações de banco de dados
 */
const getTypeOrmModuleOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<string>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User],
  migrations: [UsersMigration],
  synchronize: true,
});

/**
 * Módulo de Configuração
 * @description Esse módulo é responsável pela configuração global do projeto.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          // Configurando variáveis de ambiente
          envFilePath: ['.env.development.local'],
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmModuleOptions(configService),
    }),
  ],
})
export class ConfigGlobalModule {}

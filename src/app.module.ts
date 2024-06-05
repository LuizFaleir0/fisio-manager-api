import { Module } from '@nestjs/common';
import { ConfigGlobalModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

/**
 * Módulo Principal
 * @description Este módulo atua como ponto de entrada da aplicação
 */
@Module({
  imports: [ConfigGlobalModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

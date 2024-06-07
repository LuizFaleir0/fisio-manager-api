import { IsNotEmpty, IsString } from 'class-validator';
import { ConfirmedValidator } from '../../validators/ConfirmedValidator';

/**
 * Validação de criação de usuário
 */
export class CreateUserDto {
  /**
   * Nome Completo de Usuário
   */
  @IsNotEmpty({ message: 'O campo full_name é requerido!' })
  @IsString({ message: 'O campo full_name precisa ser do tipo string!' })
  full_name: string;

  /**
   * Senha de Usuário
   */
  @IsNotEmpty({ message: 'O campo password é requerido!' })
  @IsString({ message: 'O campo password precisa ser do tipo string!' })
  password: string;

  /**
   * Confirmação de Senha de Usuário
   */
  @IsNotEmpty({ message: 'O campo password_confirmation é requerido!' })
  @IsString({
    message: 'O campo password_confirmation precisa ser do tipo string!',
  })
  @ConfirmedValidator('password', {
    message: 'A confirmação de senha é diferente!',
  })
  password_confirmation: string;

  /**
   * Telefone de Usuário
   */
  @IsString({ message: 'O campo phone precisa ser do tipo string' })
  phone?: string;

  /**
   * Nome de Usuário
   */
  @IsNotEmpty({ message: 'O campo user_name é requerido!' })
  @IsString({ message: 'O campo user_name precisa ser do tipo string' })
  user_name: string;
}

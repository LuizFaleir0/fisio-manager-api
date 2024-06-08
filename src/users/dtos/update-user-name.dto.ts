import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Validação de atualização de dados do usuário
 */
export class UpdateUserNameDto {
  /**
   * Identificador de usuário
   */
  @IsNotEmpty({ message: 'O campo uuid é requerido!' })
  @IsString({ message: 'O campo uuid precisa ser do tipo string!' })
  uuid: string;
  /**
   * Nome de Usuário
   */
  @IsNotEmpty({ message: 'O campo user_name é requerido!' })
  @IsString({ message: 'O campo user_name precisa ser do tipo string' })
  user_name: string;
}

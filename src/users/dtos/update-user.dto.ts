import { IsString, IsObject, Validate, IsNotEmpty } from 'class-validator';

/**
 * Validação de dados do usuário
 */
class UserData {
  /**
   * Nome Completo de Usuário
   */
  @IsString({ message: 'O campo full_name precisa ser do tipo string!' })
  full_name: string;

  /**
   * Telefone de Usuário
   */
  @IsString({ message: 'O campo phone precisa ser do tipo string!' })
  phone?: string;
}

/**
 * Validação de atualização de dados do usuário
 */
export class UpdateUserDto {
  /**
   * Identificador de usuário
   */
  @IsNotEmpty({ message: 'O campo uuid é requerido!' })
  @IsString({ message: 'O campo uuid precisa ser do tipo string!' })
  uuid: string;
  /**
   * Dados de usuário
   */
  @IsObject()
  @Validate(UserData)
  user: UserData;
}

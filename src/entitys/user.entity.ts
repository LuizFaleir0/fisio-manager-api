import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  /**
   * UUID do usuário
   */
  @PrimaryColumn()
  uuid: string;

  /**
   * Nome completo do usuário
   */
  @Column()
  full_name: string;

  /**
   * Nome de usuário
   */
  @Column()
  user_name: string;

  /**
   * Número de telefone do usuário
   */
  @Column({ nullable: true })
  phone?: string;

  /**
   * Senha do usuário
   */
  @Column()
  password: string;

  /**
   * Situação da conta do usuário
   */
  @Column({ default: true })
  is_active: boolean;

  /**
   * Data da criação da conta do usuário
   */
  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;

  /**
   * Data da última atualização da conta do usuário
   */
  @UpdateDateColumn({ default: () => 'NOW()' })
  updated_at: Date;
}

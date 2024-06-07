import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {
  /**
   * UUID do Token
   */
  @PrimaryColumn()
  uuid: string;

  /**
   * Token de autenticação
   */
  @Column()
  token: string;

  /**
   * Data da criação do token
   */
  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;

  /**
   * Data da expiração do token
   */
  @Column({ default: () => 'NOW()' })
  expires_at: Date;
}

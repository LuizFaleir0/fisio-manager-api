import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migração de Usuários
 * @description Cria a tabela de usuários com campos essenciais para gerenciar informações pessoais dos usuários.
 * @version 1.0
 */
export class UsersMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criando tabela de usuários
    const userTable = new Table({
      name: 'users',
      columns: [
        {
          name: 'uuid',
          type: 'uuid',
          isPrimary: true,
        },
        {
          name: 'full_name',
          type: 'varchar',
        },
        {
          name: 'phone',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'password',
          type: 'varchar',
        },
        {
          name: 'is_active',
          type: 'boolean',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });
    await queryRunner.createTable(userTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Removendo a tabela de usuários caso seja necessário reverter esta migração
    await queryRunner.dropTable('users');
  }
}

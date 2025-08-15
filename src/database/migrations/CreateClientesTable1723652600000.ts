import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateClientesTable1723652600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('clientes');
    if (!exists) {
      await queryRunner.createTable(new Table({
        name: 'clientes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'nome', type: 'text', isNullable: false },
          { name: 'contato', type: 'text', isNullable: true },
          { name: 'email', type: 'text', isNullable: true },
          { name: 'cpf', type: 'text', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }));
      await queryRunner.createIndex('clientes', new TableIndex({ name: 'IDX_clientes_user_id', columnNames: ['user_id'] }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('clientes');
    if (exists) {
      await queryRunner.dropIndex('clientes', 'IDX_clientes_user_id');
      await queryRunner.dropTable('clientes');
    }
  }
}




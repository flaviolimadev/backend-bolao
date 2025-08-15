import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSalesTable1723653200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('sales');
    if (!exists) {
      await queryRunner.createTable(new Table({
        name: 'sales',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'customer_id', type: 'uuid', isNullable: false },
          { name: 'edition_id', type: 'uuid', isNullable: false },
          { name: 'promotora_id', type: 'uuid', isNullable: true },
          { name: 'revendedor_id', type: 'uuid', isNullable: true },
          { name: 'sale_type', type: 'varchar', length: '20' },
          { name: 'amount', type: 'int' },
          { name: 'quotas_quantity', type: 'int', isNullable: true },
          { name: 'payment_status', type: 'varchar', length: '20', default: `'pending'` },
          { name: 'sale_origin', type: 'varchar', length: '20', default: `'direct'` },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }));
      await queryRunner.createIndex('sales', new TableIndex({ name: 'IDX_sales_user_id', columnNames: ['user_id'] }));
      await queryRunner.createIndex('sales', new TableIndex({ name: 'IDX_sales_edition_id', columnNames: ['edition_id'] }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('sales');
    if (exists) {
      await queryRunner.dropIndex('sales', 'IDX_sales_edition_id');
      await queryRunner.dropIndex('sales', 'IDX_sales_user_id');
      await queryRunner.dropTable('sales');
    }
  }
}




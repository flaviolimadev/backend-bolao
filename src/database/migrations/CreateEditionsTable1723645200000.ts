import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateEditionsTable1723645200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'editions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
        { name: 'user_id', type: 'uuid', isNullable: false },
        { name: 'edition_number', type: 'int', isNullable: false },
        { name: 'draw_date', type: 'timestamp', isNullable: false },
        { name: 'individual_card_price', type: 'int', isNullable: false },
        { name: 'bolao_quota_price', type: 'int', isNullable: false },
        { name: 'quotas_per_group', type: 'int', isNullable: false },
        { name: 'cards_per_group', type: 'int', isNullable: false },
        { name: 'is_active', type: 'boolean', default: false },
        { name: 'status', type: 'varchar', length: '20', default: `'draft'` },
        { name: 'sales_paused', type: 'boolean', default: false },
        { name: 'prize_image_url', type: 'text', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
        { name: 'updated_at', type: 'timestamp', default: 'now()' },
      ],
    }));

    await queryRunner.createIndex('editions', new TableIndex({
      name: 'IDX_editions_number_unique',
      columnNames: ['edition_number'],
      isUnique: true,
    }));
    await queryRunner.createIndex('editions', new TableIndex({
      name: 'IDX_editions_user_id',
      columnNames: ['user_id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('editions', 'IDX_editions_user_id');
    await queryRunner.dropIndex('editions', 'IDX_editions_number_unique');
    await queryRunner.dropTable('editions');
  }
}



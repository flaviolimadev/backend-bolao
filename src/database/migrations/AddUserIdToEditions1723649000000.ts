import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddUserIdToEditions1723649000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUserId = await queryRunner.hasColumn('editions', 'user_id');
    if (!hasUserId) {
      await queryRunner.addColumn('editions', new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }));
      await queryRunner.createIndex('editions', new TableIndex({
        name: 'IDX_editions_user_id',
        columnNames: ['user_id'],
      }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasUserId = await queryRunner.hasColumn('editions', 'user_id');
    if (hasUserId) {
      await queryRunner.dropIndex('editions', 'IDX_editions_user_id');
      await queryRunner.dropColumn('editions', 'user_id');
    }
  }
}




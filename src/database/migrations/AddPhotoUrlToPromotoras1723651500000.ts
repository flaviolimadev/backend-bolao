import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhotoUrlToPromotoras1723651500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasColumn('promotoras', 'photo_url');
    if (!has) {
      await queryRunner.addColumn('promotoras', new TableColumn({ name: 'photo_url', type: 'text', isNullable: true }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasColumn('promotoras', 'photo_url');
    if (has) {
      await queryRunner.dropColumn('promotoras', 'photo_url');
    }
  }
}




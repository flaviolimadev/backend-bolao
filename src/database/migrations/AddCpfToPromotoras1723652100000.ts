import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCpfToPromotoras1723652100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasColumn('promotoras', 'cpf');
    if (!has) {
      await queryRunner.addColumn('promotoras', new TableColumn({ name: 'cpf', type: 'text', isNullable: true }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasColumn('promotoras', 'cpf');
    if (has) {
      await queryRunner.dropColumn('promotoras', 'cpf');
    }
  }
}




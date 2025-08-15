import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateIndividualCardsTable1723654000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('individual_cards');
    if (!exists) {
      await queryRunner.createTable(new Table({
        name: 'individual_cards',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'sale_id', type: 'uuid', isNullable: false },
          { name: 'edition_id', type: 'uuid', isNullable: false },
          { name: 'card_number', type: 'varchar', length: '20', isNullable: false },
          { name: 'card_sent', type: 'boolean', default: false },
          { name: 'whatsapp_sent', type: 'boolean', default: false },
          { name: 'sent_at', type: 'timestamp', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }));

      // Índices
      await queryRunner.createIndex('individual_cards', new TableIndex({ 
        name: 'IDX_individual_cards_sale_id', 
        columnNames: ['sale_id'] 
      }));
      await queryRunner.createIndex('individual_cards', new TableIndex({ 
        name: 'IDX_individual_cards_edition_id', 
        columnNames: ['edition_id'] 
      }));
      await queryRunner.createIndex('individual_cards', new TableIndex({ 
        name: 'IDX_individual_cards_card_number', 
        columnNames: ['card_number'] 
      }));

      // Foreign Keys
      await queryRunner.createForeignKey('individual_cards', new TableForeignKey({
        name: 'FK_individual_cards_sale_id',
        columnNames: ['sale_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sales',
        onDelete: 'CASCADE',
      }));

      await queryRunner.createForeignKey('individual_cards', new TableForeignKey({
        name: 'FK_individual_cards_edition_id',
        columnNames: ['edition_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'editions',
        onDelete: 'CASCADE',
      }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasTable('individual_cards');
    if (exists) {
      await queryRunner.dropForeignKey('individual_cards', 'FK_individual_cards_edition_id');
      await queryRunner.dropForeignKey('individual_cards', 'FK_individual_cards_sale_id');
      await queryRunner.dropIndex('individual_cards', 'IDX_individual_cards_card_number');
      await queryRunner.dropIndex('individual_cards', 'IDX_individual_cards_edition_id');
      await queryRunner.dropIndex('individual_cards', 'IDX_individual_cards_sale_id');
      await queryRunner.dropTable('individual_cards');
    }
  }
}

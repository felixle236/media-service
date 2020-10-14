import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1602342444884 implements MigrationInterface {
    name = 'Initialize1602342444884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "media_type_enum" AS ENUM(\'document\', \'image\', \'video\')');
        await queryRunner.query('CREATE TABLE "media" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "app_id" uuid NOT NULL, "created_by_id" uuid, "type" "media_type_enum" NOT NULL, "name" character varying(200) NOT NULL, "extension" character varying(4) NOT NULL, "size" integer NOT NULL, "info" json, "optimizations" json, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_3ebd37566fdf9a1e4586f765bc" ON "media" ("app_id", "created_by_id", "type") ');
        await queryRunner.query('CREATE TABLE "application" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "api_key" character varying(64) NOT NULL, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_7e6747dd68fcc35c17bd4693a0" ON "application" ("name") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_55ec1add71d42ef9e34366088a" ON "application" ("api_key") WHERE deleted_at IS NULL');
        await queryRunner.query('ALTER TABLE "media" ADD CONSTRAINT "FK_7024e885ec081919508553ce47b" FOREIGN KEY ("app_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "media" DROP CONSTRAINT "FK_7024e885ec081919508553ce47b"');
        await queryRunner.query('DROP INDEX "IDX_55ec1add71d42ef9e34366088a"');
        await queryRunner.query('DROP INDEX "IDX_7e6747dd68fcc35c17bd4693a0"');
        await queryRunner.query('DROP TABLE "application"');
        await queryRunner.query('DROP INDEX "IDX_3ebd37566fdf9a1e4586f765bc"');
        await queryRunner.query('DROP TABLE "media"');
        await queryRunner.query('DROP TYPE "media_type_enum"');
    }
}

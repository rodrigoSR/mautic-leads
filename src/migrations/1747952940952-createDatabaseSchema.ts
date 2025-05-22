import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabaseSchema1747952940952 implements MigrationInterface {
  name = 'CreateDatabaseSchema1747952940952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "mautic_id" bigint, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "ip_address" character varying NOT NULL, "last_updated" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c791b0282cbcea499ab1176b04" UNIQUE ("mautic_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "utm_source" character varying, "utm_medium" character varying, "utm_campaign" character varying, "utm_content" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "campaign"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}

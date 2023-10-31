module.exports = class Data1698712646124 {
    name = 'Data1698712646124'

    async up(db) {
        await db.query(`CREATE TABLE "stake_pool" ("id" character varying NOT NULL, "owner_rewards" numeric NOT NULL, "delegator_rewards" numeric NOT NULL, "total_rewards" numeric NOT NULL, "owner_id" character varying, CONSTRAINT "PK_646d137a2979aa231fa880711f3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9dc40c97caad68a3c0a6b9ee71" ON "stake_pool" ("owner_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "stake_pool" ADD CONSTRAINT "FK_9dc40c97caad68a3c0a6b9ee711" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "stake_pool"`)
        await db.query(`DROP INDEX "public"."IDX_9dc40c97caad68a3c0a6b9ee71"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`ALTER TABLE "stake_pool" DROP CONSTRAINT "FK_9dc40c97caad68a3c0a6b9ee711"`)
    }
}

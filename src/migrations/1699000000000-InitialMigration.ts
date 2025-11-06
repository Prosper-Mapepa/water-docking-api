import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1699000000000 implements MigrationInterface {
  name = 'InitialMigration1699000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types (only if they don't exist)
    // Use DO block with exception handling to prevent duplicate key errors
    const createEnumIfNotExists = async (enumName: string, values: string[]) => {
      try {
        // Check if type exists in public schema
        const result = await queryRunner.query(
          `SELECT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE t.typname = $1 AND n.nspname = 'public'
          )`,
          [enumName],
        );
        
        if (!result[0].exists) {
          await queryRunner.query(
            `CREATE TYPE "public"."${enumName}" AS ENUM(${values.map(v => `'${v}'`).join(', ')})`,
          );
        }
      } catch (error: any) {
        // If type already exists (race condition or corruption), ignore error
        const errorMessage = error.message || String(error);
        const errorCode = error.code || '';
        
        if (
          errorMessage.includes('already exists') ||
          errorMessage.includes('duplicate key') ||
          errorCode === '42P07' ||
          errorCode === '23505' // Unique violation
        ) {
          console.log(`⚠️  Enum ${enumName} already exists, skipping...`);
          return;
        }
        // Re-throw other errors
        throw error;
      }
    };

    // Check if table exists
    const tableExists = async (tableName: string): Promise<boolean> => {
      const result = await queryRunner.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = '${tableName}'
        )`,
      );
      return result[0].exists;
    };

    await createEnumIfNotExists('users_role_enum', ['ADMIN', 'MANAGER', 'STAFF']);
    await createEnumIfNotExists('customers_membershiptier_enum', ['BASIC', 'SILVER', 'GOLD', 'PLATINUM']);
    await createEnumIfNotExists('docks_status_enum', ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE']);
    await createEnumIfNotExists('docks_size_enum', ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);
    await createEnumIfNotExists('assets_type_enum', ['DOCK', 'POWER_STATION', 'WATER_SYSTEM', 'FUEL_STATION', 'EQUIPMENT', 'BUILDING', 'OTHER']);
    await createEnumIfNotExists('assets_status_enum', ['OPERATIONAL', 'MAINTENANCE_REQUIRED', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE']);
    await createEnumIfNotExists('service_requests_status_enum', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
    await createEnumIfNotExists('service_requests_priority_enum', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
    await createEnumIfNotExists('feedback_category_enum', ['SERVICE_QUALITY', 'FACILITIES', 'STAFF', 'PRICING', 'GENERAL']);
    await createEnumIfNotExists('feedback_sentimentscore_enum', ['VERY_NEGATIVE', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'VERY_POSITIVE']);
    await createEnumIfNotExists('maintenance_records_type_enum', ['ROUTINE', 'PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']);
    await createEnumIfNotExists('maintenance_records_status_enum', ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

    // Create users table
    if (!(await tableExists('users'))) {
      await queryRunner.query(
        `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'STAFF',
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )`,
      );
    }

    // Create customers table
    if (!(await tableExists('customers'))) {
      await queryRunner.query(
        `CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "address" character varying,
        "membershipTier" "public"."customers_membershiptier_enum" NOT NULL DEFAULT 'BASIC',
        "loyaltyPoints" integer NOT NULL DEFAULT 0,
        "preferences" jsonb,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customers_email" UNIQUE ("email"),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      )`,
      );
    }

    // Create docks table
    if (!(await tableExists('docks'))) {
      await queryRunner.query(
        `CREATE TABLE "docks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "dockNumber" character varying NOT NULL,
        "name" character varying NOT NULL,
        "size" "public"."docks_size_enum" NOT NULL DEFAULT 'MEDIUM',
        "status" "public"."docks_status_enum" NOT NULL DEFAULT 'AVAILABLE',
        "location" character varying,
        "description" text,
        "maxBoatLength" numeric(5,2),
        "depth" numeric(5,2),
        "powerAmperage" integer,
        "hasWater" boolean NOT NULL DEFAULT true,
        "hasSewage" boolean NOT NULL DEFAULT false,
        "hasFuel" boolean NOT NULL DEFAULT false,
        "amenities" jsonb,
        "builtDate" date,
        "lastMaintenanceDate" date,
        "nextMaintenanceDate" date,
        "maintenanceInterval" integer,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_docks_dockNumber" UNIQUE ("dockNumber"),
        CONSTRAINT "PK_docks" PRIMARY KEY ("id")
      )`,
      );
    }

    // Create assets table
    if (!(await tableExists('assets'))) {
      await queryRunner.query(
        `CREATE TABLE "assets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "type" "public"."assets_type_enum" NOT NULL,
        "identifier" character varying,
        "description" text,
        "location" character varying,
        "status" "public"."assets_status_enum" NOT NULL DEFAULT 'OPERATIONAL',
        "purchaseDate" date,
        "purchasePrice" numeric(10,2),
        "warrantyExpiration" date,
        "warrantyExpiry" date,
        "expectedLifespanYears" integer,
        "specifications" jsonb,
        "maintenanceInterval" integer,
        "lastMaintenanceDate" date,
        "nextMaintenanceDate" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assets" PRIMARY KEY ("id")
      )`,
      );
    }

    // Create visits table
    if (!(await tableExists('visits'))) {
      await queryRunner.query(
        `CREATE TABLE "visits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "checkInTime" TIMESTAMP NOT NULL,
        "checkOutTime" TIMESTAMP,
        "dockNumber" character varying NOT NULL,
        "boatName" character varying,
        "boatType" character varying,
        "serviceCharges" numeric(10,2) NOT NULL DEFAULT 0,
        "servicesUsed" jsonb,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_visits" PRIMARY KEY ("id"),
        CONSTRAINT "FK_visits_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
      );
    }

    // Create service_requests table
    if (!(await tableExists('service_requests'))) {
      await queryRunner.query(
        `CREATE TABLE "service_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "serviceType" character varying NOT NULL,
        "description" text NOT NULL,
        "title" character varying,
        "status" "public"."service_requests_status_enum" NOT NULL DEFAULT 'PENDING',
        "priority" "public"."service_requests_priority_enum" NOT NULL DEFAULT 'MEDIUM',
        "scheduledDate" TIMESTAMP,
        "requestedDate" TIMESTAMP,
        "completedDate" TIMESTAMP,
        "estimatedCost" numeric(10,2),
        "actualCost" numeric(10,2),
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_requests_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
      );
    }

    // Create feedback table
    if (!(await tableExists('feedback'))) {
      await queryRunner.query(
        `CREATE TABLE "feedback" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "category" "public"."feedback_category_enum" NOT NULL DEFAULT 'GENERAL',
        "rating" integer,
        "comments" text NOT NULL,
        "sentimentScore" "public"."feedback_sentimentscore_enum",
        "reviewed" boolean NOT NULL DEFAULT false,
        "staffResponse" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_feedback" PRIMARY KEY ("id"),
        CONSTRAINT "FK_feedback_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
      );
    }

    // Create maintenance_records table
    if (!(await tableExists('maintenance_records'))) {
      await queryRunner.query(
        `CREATE TABLE "maintenance_records" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "assetId" uuid,
        "dockId" uuid,
        "type" "public"."maintenance_records_type_enum" NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "status" "public"."maintenance_records_status_enum" NOT NULL DEFAULT 'SCHEDULED',
        "scheduledDate" TIMESTAMP NOT NULL,
        "completedDate" TIMESTAMP,
        "assignedTo" character varying,
        "estimatedCost" numeric(10,2),
        "actualCost" numeric(10,2),
        "workPerformed" text,
        "partsReplaced" text,
        "photos" text,
        "notes" text,
        "laborHours" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_maintenance_records" PRIMARY KEY ("id"),
        CONSTRAINT "FK_maintenance_records_asset" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_maintenance_records_dock" FOREIGN KEY ("dockId") REFERENCES "docks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
      );
    }

    // Create indexes (only if they don't exist)
    const createIndexIfNotExists = async (indexName: string, tableName: string, columns: string) => {
      const result = await queryRunner.query(
        `SELECT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = '${indexName}'
        )`,
      );
      if (!result[0].exists) {
        await queryRunner.query(
          `CREATE INDEX "${indexName}" ON "${tableName}" (${columns})`,
        );
      }
    };

    await createIndexIfNotExists('IDX_visits_customerId', 'visits', '"customerId"');
    await createIndexIfNotExists('IDX_service_requests_customerId', 'service_requests', '"customerId"');
    await createIndexIfNotExists('IDX_feedback_customerId', 'feedback', '"customerId"');
    await createIndexIfNotExists('IDX_maintenance_records_assetId', 'maintenance_records', '"assetId"');
    await createIndexIfNotExists('IDX_maintenance_records_dockId', 'maintenance_records', '"dockId"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_maintenance_records_dockId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_maintenance_records_assetId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_feedback_customerId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_service_requests_customerId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_visits_customerId"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "maintenance_records"`);
    await queryRunner.query(`DROP TABLE "feedback"`);
    await queryRunner.query(`DROP TABLE "service_requests"`);
    await queryRunner.query(`DROP TABLE "visits"`);
    await queryRunner.query(`DROP TABLE "assets"`);
    await queryRunner.query(`DROP TABLE "docks"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."maintenance_records_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."maintenance_records_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."feedback_sentimentscore_enum"`);
    await queryRunner.query(`DROP TYPE "public"."feedback_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."service_requests_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."service_requests_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."assets_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."assets_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."docks_size_enum"`);
    await queryRunner.query(`DROP TYPE "public"."docks_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."customers_membershiptier_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}


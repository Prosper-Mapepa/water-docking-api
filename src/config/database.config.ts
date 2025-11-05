import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Prioritize DATABASE_URL if available (Railway's preferred method)
const dbConfig: any = {
  type: 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always use migrations in production
  logging: process.env.NODE_ENV === 'development',
};

if (process.env.DATABASE_URL) {
  dbConfig.url = process.env.DATABASE_URL;
} else {
  dbConfig.host = process.env.PGHOST || process.env.DB_HOST || 'localhost';
  dbConfig.port = parseInt(process.env.PGPORT || process.env.DB_PORT || '5432');
  dbConfig.username = process.env.PGUSER || process.env.DB_USERNAME || 'postgres';
  dbConfig.password = process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres';
  dbConfig.database = process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking';
}

export const AppDataSource = new DataSource(dbConfig);




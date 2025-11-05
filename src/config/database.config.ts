import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
  username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
  database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
  url: process.env.DATABASE_URL, // Railway may provide DATABASE_URL
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always use migrations in production
  logging: process.env.NODE_ENV === 'development',
});




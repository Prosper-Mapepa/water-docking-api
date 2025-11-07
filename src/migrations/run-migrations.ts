import { createAppDataSource } from '../config/database.config';

async function runMigrations() {
  const dataSource = createAppDataSource();

  try {
    console.log('🚀 Initializing database connection...');
    console.log('Database config:', {
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
      database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
      username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
      hasUrl: !!process.env.DATABASE_URL,
    });
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    console.log('📦 Running migrations...');
    const migrations = await dataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ No pending migrations - database is up to date');
    }
    
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack:', error.stack);
    }
    await dataSource.destroy().catch(() => {});
    process.exit(1);
  }
}

runMigrations();


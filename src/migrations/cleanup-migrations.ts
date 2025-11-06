import { AppDataSource } from '../config/database.config';

async function cleanupMigrations() {
  try {
    console.log('🧹 Cleaning up migrations table...');
    await AppDataSource.initialize();
    
    // Drop migrations table and sequence if they exist
    await AppDataSource.query(`
      DROP TABLE IF EXISTS migrations CASCADE;
      DROP SEQUENCE IF EXISTS migrations_id_seq CASCADE;
    `);
    
    console.log('✅ Cleanup completed');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    await AppDataSource.destroy().catch(() => {});
    process.exit(1);
  }
}

cleanupMigrations();


import { createAppDataSource } from '../config/database.config';

async function cleanupMigrations() {
  const dataSource = createAppDataSource();

  try {
    console.log('🧹 Cleaning up migrations table...');
    await dataSource.initialize();
    
    // Drop migrations table and sequence if they exist
    await dataSource.query(`
      DROP TABLE IF EXISTS migrations CASCADE;
      DROP SEQUENCE IF EXISTS migrations_id_seq CASCADE;
    `);
    
    console.log('✅ Cleanup completed');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    await dataSource.destroy().catch(() => {});
    process.exit(1);
  }
}

cleanupMigrations();


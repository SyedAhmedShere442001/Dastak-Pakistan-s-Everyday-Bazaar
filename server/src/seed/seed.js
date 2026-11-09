import '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

async function run() {
  try {
    await connectDB();
    const result = await seedDatabase({ force: true });
    console.log(
      `[seed] Reset complete — ${result.products} products across ${result.categories} categories.`
    );
    console.log('[seed] Admin:    admin@dastak.pk / Admin@123');
    console.log('[seed] Customer: customer@dastak.pk / Customer@123');
  } catch (error) {
    console.error('[seed] Failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

run();

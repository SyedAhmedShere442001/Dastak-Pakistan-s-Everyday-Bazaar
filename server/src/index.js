import './config/env.js';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';

const PORT = Number(process.env.PORT || 5000);

async function start() {
  await connectDB();

  if (process.env.AUTO_SEED !== 'false') {
    const result = await seedDatabase({ force: false });
    if (result.seeded) {
      console.log(
        `[seed] Demo catalog ready — ${result.products} products across ${result.categories} categories.`
      );
      console.log('[seed] Admin: admin@dastak.pk / Admin@123 · Customer: customer@dastak.pk / Customer@123');
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`[api] Dastak API running at http://localhost:${PORT}`);
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[api] ${signal} received — closing the shop...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('[api] Could not start Dastak:', error);
  process.exit(1);
});

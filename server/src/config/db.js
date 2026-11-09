import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let memoryServer = null;

export async function connectDB() {
  const configuredUri = process.env.MONGODB_URI?.trim();

  if (configuredUri) {
    await mongoose.connect(configuredUri, {
      dbName: process.env.MONGODB_DB || undefined
    });
    console.log(`[db] Connected to MongoDB at ${mongoose.connection.host}/${mongoose.connection.name}`);
    return;
  }

  // Zero-setup local mode: a real MongoDB process managed by the API,
  // persisted under server/.data/mongo so data survives restarts.
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const dbPath = path.resolve(__dirname, '../../.data/mongo');
  fs.mkdirSync(dbPath, { recursive: true });

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbPath,
      storageEngine: 'wiredTiger'
    }
  });

  await mongoose.connect(memoryServer.getUri(), { dbName: process.env.MONGODB_DB || 'dastak' });

  console.log('[db] No MONGODB_URI set — using the persistent local MongoDB in server/.data/mongo.');
  console.log('[db] Add a MongoDB Atlas URI to server/.env whenever you want a cloud database.');
}

export async function disconnectDB() {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop({ doCleanup: false });
    memoryServer = null;
  }
}

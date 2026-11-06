import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    // Don't kill process immediately in dev so app can start with warnings
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '3000'), 10),
  DATABASE_URL: getEnvVar('DATABASE_URL', ''),
};

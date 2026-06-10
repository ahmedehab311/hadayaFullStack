// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// interface EnvConfig {
//   NODE_ENV: string;
//   PORT: number;
//   DATABASE_URL: string;
// }

// function getEnvVar(key: string, defaultValue?: string): string {
//   const value = process.env[key] ?? defaultValue;
//   if (value === undefined || value === '') {
//     console.error(`❌ Missing env variable: ${key}`);
//     process.exit(1); 
//   }
//   return value;
// }
// export const env: EnvConfig = {
//   NODE_ENV: getEnvVar('NODE_ENV', 'development'),
//   PORT: parseInt(getEnvVar('PORT', '3000'), 10),
//   DATABASE_URL: getEnvVar('DATABASE_URL', ''),
// };
// env.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  API_KEY: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined || value === '') {
    console.error(`❌ Missing env variable: ${key}`);
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '7860'), 10),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  API_KEY: getEnvVar('API_KEY'),
};
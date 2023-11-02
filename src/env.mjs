import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID: z.string(),
    GOOGLE_CLIENT_EMAIL: z.string(),
    GOOGLE_PRIVATE_KEY: z.string(),
    GOOGLE_APPS_SCRIPT_URL: z.string(),
    GOOGLE_DRIVE_FOLDER_ID: z.string(),
  },
  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID: process.env.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_APPS_SCRIPT_URL: `https://script.google.com/macros/s/${process.env.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID}/exec`,
  },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION && !['0', 'false'].includes(process.env.SKIP_ENV_VALIDATION),
});

export { env };

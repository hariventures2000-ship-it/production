import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1).optional(), // Optional for dev environments
  RAZORPAY_KEY_ID: z.string().min(1).optional(), // Optional for dev environments
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(), // Using optional to prevent local breakage if not strict
}).passthrough();

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  
  if (!parsed.success) {
    console.error('❌ FATAL: Invalid Environment Configuration');
    console.error(parsed.error.format());
    process.exit(1); // Fail-fast on startup
  }
  
  return parsed.data;
}

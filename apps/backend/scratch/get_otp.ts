import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const OtpAttemptSchema = new mongoose.Schema({}, { strict: false });
const OtpAttempt = mongoose.model('OtpAttempt', OtpAttemptSchema, 'otpAttempts');

async function getOtp() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const otp = await OtpAttempt.findOne({ email: 'client@hariventure.com' }).sort({ createdAt: -1 }).lean();
  
  if (otp) {
    console.log(`\n--- LATEST OTP FOR client@hariventure.com ---`);
    console.log(`OTP Code: ${(otp as any).otp}`);
    console.log(`Expires At: ${(otp as any).expiresAt}`);
    console.log(`---------------------------------------------\n`);
  } else {
    console.log(`\nNo OTP found for client@hariventure.com!`);
  }

  process.exit(0);
}

getOtp().catch(console.error);

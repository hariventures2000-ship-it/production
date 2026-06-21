import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const OtpSchema = new mongoose.Schema({}, { strict: false });
const Otp = mongoose.model('Otp', OtpSchema, 'otpAttempts');

async function checkOtp() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const otps = await Otp.find({}).sort({ createdAt: -1 }).limit(10);
  console.log(JSON.stringify(otps, null, 2));

  process.exit(0);
}

checkOtp().catch(console.error);

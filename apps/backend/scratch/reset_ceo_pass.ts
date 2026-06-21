import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema, 'users');

async function resetPass() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash('SecurePass123!', 10);

  const result = await User.updateOne(
    { email: 'ceo@hariventure.com' },
    {
      $set: {
        internalPasswordHash: passwordHash,
        failedLoginAttempts: 0,
        lockoutUntil: null
      }
    }
  );

  console.log(`Updated CEO user: ${result.modifiedCount} modified.`);

  process.exit(0);
}

resetPass().catch(console.error);

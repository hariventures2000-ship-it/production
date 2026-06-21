import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema, 'users');

async function fetch() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const roles = [
    'CLIENT',
    'CEO',
    'MANAGING_DIRECTOR',
    'HR',
    'TEAM_LEAD',
    'EMPLOYEE'
  ];

  console.log('\n--- SYSTEM CREDENTIALS ---');

  for (const role of roles) {
    const user: any = await User.findOne({ role }).lean();
    if (user) {
      if (role === 'CLIENT') {
        console.log(`\nRole: ${role}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: (Passwordless OTP / Use client login flow)`);
      } else {
        console.log(`\nRole: ${role}`);
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email || 'N/A'}`);
        console.log(`Password: (Default is SecurePass123! or check local configuration)`);
      }
    } else {
      console.log(`\nRole: ${role} - No user found in DB!`);
    }
  }

  console.log('\n--------------------------\n');
  process.exit(0);
}

fetch().catch(console.error);

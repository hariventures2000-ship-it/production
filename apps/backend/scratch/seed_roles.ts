import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema, 'users');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const passwordHash = await bcrypt.hash('SecurePass123!', 10);

  const roles = [
    'CEO',
    'MANAGING_DIRECTOR',
    'HR',
    'TEAM_LEAD',
    'EMPLOYEE'
  ];

  for (const role of roles) {
    const username = `${role.toLowerCase()}_user`;
    const email = `${role.toLowerCase()}@hariventure.com`;
    
    await User.updateOne(
      { username },
      {
        $set: {
          role,
          authType: 'INTERNAL',
          firstName: role,
          lastName: 'User',
          username,
          email,
          internalPasswordHash: passwordHash,
          isActive: true,
          tokenVersion: 0,
          mfaEnabled: false
        }
      },
      { upsert: true }
    );
    console.log(`Seeded Internal Role: ${role} | Username: ${username} | Password: SecurePass123!`);
  }

  // Client
  await User.updateOne(
    { email: 'client@hariventure.com' },
    {
      $set: {
        role: 'CLIENT',
        authType: 'CLIENT',
        firstName: 'Client',
        lastName: 'User',
        email: 'client@hariventure.com',
        isActive: true,
        tokenVersion: 0,
      }
    },
    { upsert: true }
  );
  console.log(`Seeded Client Role: CLIENT | Email: client@hariventure.com | Passwordless (OTP)`);

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(console.error);

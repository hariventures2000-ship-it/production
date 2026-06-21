require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hariventures2000_db_user:CQQPdWJcYFOz5ayS@mervi.5qluf6e.mongodb.net/hariventure?appName=mervi';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const password = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const internalPasswordHash = await bcrypt.hash(password, salt);

    const now = new Date();

    const roles = [
      {
        role: 'CEO',
        authType: 'INTERNAL',
        username: 'ceo',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'ceo@hariventure.com',
      },
      {
        role: 'MANAGING_DIRECTOR',
        authType: 'INTERNAL',
        username: 'md',
        firstName: 'Managing',
        lastName: 'Director',
        email: 'md@hariventure.com',
      },
      {
        role: 'HR',
        authType: 'INTERNAL',
        username: 'hr',
        firstName: 'Human',
        lastName: 'Resources',
        email: 'hr@hariventure.com',
      },
      {
        role: 'TEAM_LEAD',
        authType: 'INTERNAL',
        username: 'teamlead',
        firstName: 'Team',
        lastName: 'Lead',
        email: 'lead@hariventure.com',
      },
      {
        role: 'EMPLOYEE',
        authType: 'INTERNAL',
        username: 'employee',
        firstName: 'General',
        lastName: 'Employee',
        email: 'employee@hariventure.com',
      },
      {
        role: 'CLIENT',
        authType: 'CLIENT',
        firstName: 'Valued',
        lastName: 'Client',
        email: 'client@hariventure.com',
      }
    ];

    for (const r of roles) {
      // Check if exists
      const query = r.authType === 'INTERNAL' ? { username: r.username } : { email: r.email };
      const existing = await usersCollection.findOne(query);

      if (!existing) {
        const userDoc = {
          role: r.role,
          authType: r.authType,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          isActive: true,
          mfaEnabled: false,
          isEmailVerified: true,
          createdAt: now,
          updatedAt: now,
          __v: 0
        };

        if (r.authType === 'INTERNAL') {
          userDoc.username = r.username;
          userDoc.internalPasswordHash = internalPasswordHash;
        }

        await usersCollection.insertOne(userDoc);
        console.log(`Created ${r.role} account.`);
      } else {
        console.log(`${r.role} account already exists.`);
      }
    }

    console.log('\nSeeding Complete!');
    console.log('Internal passwords set to: Password123!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();

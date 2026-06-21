// scripts/migration/01-add-tenant-to-users.js

/**
 * Migration script to add default tenantId to existing dev data.
 * Usage: node scripts/migration/01-add-tenant-to-users.js
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    
    // We assume the old users were in `mervi_users` database, `users` collection
    // Wait, the Next.js backend used a different DB maybe.
    // Assuming the DB is mervi_auth_db and users collection
    const db = client.db("mervi_auth_db");
    const usersCollection = db.collection("users");

    // 1. Create a default "Hari Ventures" internal tenant in mervi_tenant_db
    const tenantDb = client.db("mervi_tenant_db");
    const tenantsCollection = tenantDb.collection("tenants");
    
    let defaultTenant = await tenantsCollection.findOne({ slug: 'hari-ventures' });
    if (!defaultTenant) {
      console.log("Creating default tenant...");
      const result = await tenantsCollection.insertOne({
        name: "Hari Ventures",
        slug: "hari-ventures",
        domain: "hariventures.com",
        plan: "ENTERPRISE",
        status: "ACTIVE",
        maxUsers: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      defaultTenant = { _id: result.insertedId };
    }
    
    const tenantIdStr = defaultTenant._id.toString();

    // 2. Update existing users to have the default tenantId
    console.log(`Updating users with tenantId: ${tenantIdStr}`);
    const updateResult = await usersCollection.updateMany(
      { tenantId: { $exists: false } },
      { $set: { tenantId: tenantIdStr } }
    );
    
    console.log(`Migration complete. Modified ${updateResult.modifiedCount} users.`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);

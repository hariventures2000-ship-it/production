# Disaster Recovery Runbook

## Objective
Establish the technical procedures required to recover the Hariventure Enterprise Client Portal in the event of catastrophic infrastructure failure.

## RTO and RPO Targets
* **Recovery Time Objective (RTO):** 4 Hours
* **Recovery Point Objective (RPO):** 5 Minutes

## Backup Strategy (MongoDB Atlas)
1. **Continuous Cloud Backups:** Oplog backups run continuously allowing point-in-time recovery up to 5 minutes ago.
2. **Daily Snapshots:** Full database snapshots are taken at 00:00 UTC daily and retained for 30 days.

## Outage Procedures
### 1. Primary Database Outage
1. **Detect:** `AlertsService` will fire a "Database Ping Failed" critical alert.
2. **Diagnose:** Access MongoDB Atlas dashboard to confirm primary node failure.
3. **Execute:** 
   * Atlas auto-failover usually completes in < 30 seconds.
   * If entire cluster is down, provision a secondary cluster in a different availability zone.
   * Restore latest Continuous Cloud Backup snapshot to the new cluster.
   * Update `MONGODB_URI` in the production environment variables and redeploy the backend cluster.

### 2. Secrets Compromise
1. Follow `SECRETS_ROTATION_POLICY.md` to invalidate JWT Secrets and API keys.
2. Force logout all users by cycling the JWT secret.

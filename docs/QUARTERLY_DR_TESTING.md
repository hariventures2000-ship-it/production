# Quarterly Disaster Recovery Testing

## Objective
Validate the RTO and RPO metrics by physically testing failover scenarios once every quarter. Documentation alone does not protect systems; verifiable execution does.

## Required Quarterly Scenarios
1. **The DB Drop:** Spin up a sandbox cluster, populate mock data, simulate a total node failure, and attempt to restore from the latest Oplog continuous backup.
2. **The Compromised Key:** Cycle a mock JWT secret in staging, verify active sessions correctly terminate, and verify system safely reboots without environment errors.
3. **The Webhook Outage:** Simulate Razorpay webhook failure. Verify the `BillingService` gracefully falls back or retries correctly.

## Audit Requirement
Each quarter, an execution log must be attached to this framework detailing:
* **Date of Exercise**
* **Scenario Tested**
* **Actual RTO (Recovery Time)**
* **Actual RPO (Data Loss)**
* **Identified Improvement Areas**

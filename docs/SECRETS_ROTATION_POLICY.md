# Secrets Rotation Policy

## Scope
All application secrets, including JWT Secrets, Database URIs, and Third-party API Keys (Resend, Razorpay).

## Rotation Schedule
* **JWT Secret:** Rotated every 90 days.
* **Database Credentials:** Rotated every 180 days.
* **Third-Party API Keys:** Rotated upon vendor recommendation or 365 days.

## Zero-Downtime Rotation Procedure (JWT)
1. Generate `JWT_SECRET_NEW`.
2. Update backend to decode using both `JWT_SECRET` (fallback) and `JWT_SECRET_NEW` (primary), but strictly sign new tokens with `JWT_SECRET_NEW`.
3. Wait 24 hours (expiration of all active standard tokens).
4. Remove old `JWT_SECRET`.

## Emergency Revocation
In the event of a compromised secret:
1. Immediately generate new keys.
2. Replace them in the production environment variables.
3. The `validateEnv` Zod schema will ensure the server safely restarts.
4. Notify `admin@hariventure.com` of forced session invalidation.

# Mervi Platform — Developer Login Credentials

This file contains the default login credentials for testing different portals and dashboards in local development. All database tables have been seeded with this data.

## Default Tenant details
* **Organization Name**: Hari Ventures
* **Tenant Slug**: `hari-ventures`
* **Tenant Domain**: `hariventures.com`
* **Tenant ID**: `6676aa9ae9a701309909dcda`

---

## Credentials List

All accounts share the same default password: **`Password@123`**

### 1. Client Portal
* **Email**: `client@hariventures.com`
* **Role**: `CLIENT`
* **Portal URL**: `http://localhost:3001/auth/client/login`
* **Dashboard Route**: `/dashboard/client`

### 2. Employee Portal
* **Username**: `employee`
* **Email**: `employee@hariventures.com`
* **Role**: `EMPLOYEE`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Uses Multi-Factor Auth Setup)
* **Dashboard Route**: `/dashboard/employee`

### 3. Team Lead Portal
* **Username**: `lead`
* **Email**: `lead@hariventures.com`
* **Role**: `TEAM_LEAD`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Uses Multi-Factor Auth Setup)
* **Dashboard Route**: `/dashboard/lead`

### 4. HR Portal
* **Username**: `hr`
* **Email**: `hr@hariventures.com`
* **Role**: `HR`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Uses Multi-Factor Auth Setup)
* **Dashboard Route**: `/dashboard/hr`

### 5. Managing Director (MD) Portal
* **Username**: `md`
* **Email**: `md@hariventures.com`
* **Role**: `MANAGING_DIRECTOR`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Uses Multi-Factor Auth Setup)
* **Dashboard Route**: `/dashboard/md`

### 6. CEO Portal
* **Username**: `ceo`
* **Email**: `ceo@hariventures.com`
* **Role**: `CEO`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Uses Multi-Factor Auth Setup)
* **Dashboard Route**: `/dashboard/ceo`

### 7. Platform Super Admin
* **Username**: `superadmin`
* **Email**: `superadmin@hariventures.com`
* **Role**: `SUPER_ADMIN`
* **Portal URL**: `http://localhost:3001/auth/internal/login` (Platform-wide Super Admin control)

---

> [!NOTE]
> For internal user roles, login requires completing the multi-factor authentication (MFA) setup upon first login using an authenticator app (e.g. Google Authenticator or Microsoft Authenticator).

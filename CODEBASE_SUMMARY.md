# Mervi Platform — Codebase Architecture & Reference Summary

This summary provides a single source of truth for the codebase layout, microservices, frontends, APIs, ports, authentication, databases, and shared packages. It is designed to help developer agents quickly understand the project context without scanning directories or reading multiple configuration files, saving tokens and accelerating implementation.

---

## 📂 Repository Layout

```
. (Repository Root)
├── apps/                          # Frontend Portals (Next.js, React, TailwindCSS)
│   ├── client-portal/             # Port: 3009 (Client dashboard, support tickets, invoices)
│   ├── employee-portal/           # Port: 3005 (Leave tracking, team logs, HR policies)
│   ├── landing-page/              # Port: 3000 (Landing page & main entrypoint)
│   ├── hr-portal/                 # Port: 3003 (HR administration portal)
│   ├── md-portal/                 # Port: 3006 (Managing Director high-level dashboard)
│   ├── super-admin-portal/        # Port: 3000 (Super Admin system-wide controls)
│   └── teamlead-portal/           # Port: 3007 (Operational/task management dashboard)
├── legacy-backend/                # Spring Boot Microservices
│   ├── shared/                    # Shared DTOs, Enums, Event models, Security filters
│   ├── api-gateway/               # Port: 8080 (API routing, CORS, global filter setup)
│   ├── auth-service/              # Port: 8081 (Internal/Client login, TOTP MFA validation)
│   ├── user-service/              # Port: 8082 (User profiles and tenant credentials mapping)
│   ├── tenant-service/            # Port: 8083 (SaaS Multi-tenant provisioning & isolation)
│   ├── hr-service/                # Port: 8086 (HR records and policies management)
│   ├── employee-service/          # Port: 8088 (Employee details, check-ins, tasks logs)
│   ├── client-service/            # Port: 8089 (External clients portal data backend)
│   ├── notification-service/      # Port: 8090 (Email notifications & WebSocket broadcast hub)
│   ├── analytics-service/         # Port: 8091 (Read-optimized view generators from Kafka events)
│   └── ai-service/                # Port: 8092 (Spring AI + Google Gemini/GenAI services)
├── packages/                      # Shared TS/React library packages (Turborepo)
│   ├── hooks/                     # Shared React hooks (stubs)
│   ├── types/                     # Shared Typescript schemas (Role, Project, Auth)
│   ├── ui/                        # Reusable component library (Design System inputs, modals)
│   └── utils/                     # Helper utilities (currency, dates, tailwind merge)
└── docs/                          # Runbooks, SLA monitoring, disaster recovery guidelines
```

---

## 🛜 Network Topology & Service Ports

### Backend Microservices
All REST requests pass through the central **API Gateway** on Port `8080`.

| Service | Port | Base API Path | Predicate / Route Pattern |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | `/` | Ingress gateway |
| **Auth Service** | `8081` | `/api/v1/auth` | `/api/v1/auth/**` |
| **User Service** | `8082` | `/api/v1/users` | `/api/v1/users/**` |
| **Tenant Service** | `8083` | `/api/v1/tenants` | `/api/v1/tenants/**` |
| **HR Service** | `8086` | `/api/v1/hr` | `/api/v1/hr/**` |
| **Employee Service** | `8088` | `/api/v1/employee` | `/api/v1/employee/**` |
| **Client Service** | `8089` | `/api/v1/client-portal` | `/api/v1/client-portal/**`, `/api/v1/tickets/**`, `/api/v1/client/**` |
| **Notification Service (REST)** | `8090` | `/api/v1/notifications` | `/api/v1/notifications/**` |
| **Notification Service (WS)** | `8090` | `/api/v1/notifications/ws` | `/api/v1/notifications/ws/**` |
| **Analytics Service** | `8091` | `/api/v1/analytics` | `/api/v1/analytics/**` |
| **AI Service** | `8092` | `/api/v1/ai` | `/api/v1/ai/**` |

### Frontend Applications (CORS Configured)
The API Gateway accepts requests from the following origin list:
* `http://localhost:3000` (Super Admin / Frontend landing)
* `http://localhost:3001` (CEO portal)
* `http://localhost:3003` (HR portal)
* `http://localhost:3005` (Employee portal)
* `http://localhost:3006` (MD portal)
* `http://localhost:3007` (Team Lead portal)
* `http://localhost:3009` (Client portal)

---

## 💾 Core Infrastructure (Docker Services)

The backend services run locally via `docker-compose.yml` under `legacy-backend/`:
1. **MongoDB** (`27017`): Used for primary data persistence across services. Active databases include `mervi_analytics_db`, `mervi_user_db`, etc.
2. **Redis** (`6379`): Used for API Gateway rate limiting (disabled in local development by default) and cache management.
3. **Kafka** (`9092`) & **Zookeeper** (`2181`): Handles asynchronous, event-driven processes. Key topics include:
   * `EMPLOYEE_ONBOARDED` (`EmployeeOnboardedEvent`)
   * `INVOICE_PAID` (`InvoicePaidEvent`)
   * `PROJECT_COMPLETED` (`ProjectCompletedEvent`)

---

## 🔑 Authentication, MFA & Access Roles

### Platform Roles (`Role` Enum)
Defined in both Java shared library `Role.java` and TypeScript package `@hariventure/types`:
* `SUPER_ADMIN`: System-wide administrator (platform-level).
* `CEO` & `MANAGING_DIRECTOR`: Tenant-wide executives with high-level reporting and budget authorization rights.
* `HR`: HR managers managing employee contracts, policies, and leaves.
* `TEAM_LEAD`: Middle management handling task assignments, project status updates, and leaves approvals.
* `EMPLOYEE`: Internal workers completing task logs, setting check-ins, requesting leaves.
* `CLIENT`: External clients viewing invoice PDFs, tracking milestone progress, and logging support tickets.

### Default Seeding Credentials
All accounts share the same test password: **`Password@123`**
* **Tenant ID**: `6676aa9ae9a701309909dcda` (Hari Ventures / `hariventures.com`)

| Portal | Email | Role | Login Entrypoint |
| :--- | :--- | :--- | :--- |
| **Client Portal** | `client@hariventures.com` | `CLIENT` | `http://localhost:3001/auth/client/login` |
| **Employee Portal** | `employee@hariventures.com` | `EMPLOYEE` | `http://localhost:3001/auth/internal/login` (MFA Setup) |
| **Team Lead Portal**| `lead@hariventures.com` | `TEAM_LEAD` | `http://localhost:3001/auth/internal/login` (MFA Setup) |
| **HR Portal** | `hr@hariventures.com` | `HR` | `http://localhost:3001/auth/internal/login` (MFA Setup) |
| **Managing Director**| `md@hariventures.com` | `MANAGING_DIRECTOR` | `http://localhost:3001/auth/internal/login` (MFA Setup) |
| **CEO Portal** | `ceo@hariventures.com` | `CEO` | `http://localhost:3001/auth/internal/login` (MFA Setup) |
| **Super Admin** | `superadmin@hariventures.com`| `SUPER_ADMIN` | `http://localhost:3001/auth/internal/login` (Platform-wide) |

> [!NOTE]
> Logging in to internal roles redirects the user to configure multi-factor authentication (MFA / TOTP) via authenticator applications (Google/Microsoft Authenticator) using the `totp` library.

---

## 🛠️ Shared frontend Packages (`packages/`)

### `@hariventure/types` (under `packages/types/src/`)
* **`role.ts`**: Contains `Role`, `AuthType` (`CLIENT`, `INTERNAL`, `PLATFORM`), `EmployeeSubRole` (`DEVELOPER`, `TESTER`, `UI_UX_DESIGNER`, `DEVOPS_ENGINEER`, `BUSINESS_ANALYST`), and `Department`.
* **`project.ts`**: Contains:
  * `ProjectStatus`: `PLANNING`, `DESIGN`, `DEVELOPMENT`, `TESTING`, `DEPLOYMENT`, `MAINTENANCE`, `COMPLETED`, `ON_HOLD`.
  * `ProjectPriority`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  * `TaskStatus`: `BACKLOG`, `TODO`, `IN_PROGRESS`, `REVIEW`, `TESTING`, `DONE`.
  * `TaskPriority`, `TaskType` (`FEATURE`, `BUG`, `CHORE`, `SPIKE`, `STORY`).
  * `SprintStatus`: `PLANNING`, `ACTIVE`, `COMPLETED`, `CANCELLED`.
  * Interfaces: `Milestone`, `BurndownPoint`.

---

## 📈 Status of Project Phases (`PROJECT_TASKS.md`)

* **Phase 3: Project Management & Workforce Operations (PENDING/IN-PROGRESS)**
  * Standalone `project-service` backend is planned but not fully wired/implemented (commented out in parent `pom.xml` modules).
  * `md-portal` and `teamlead-portal` are structured but largely read-only or mocked.
* **Phase 4: Client Portal (PENDING/IN-PROGRESS)**
  * `client-portal` scaffolded, `client-service` backend exists. Enforces strict isolation per `clientId`.
* **Phase 5: Analytics & Notifications (COMPLETED)**
  * `analytics-service` and `notification-service` are fully functional. Reads Kafka message streams, updates MongoDB materialized aggregates, and broadcasts updates via WebSockets.
* **Phase 6: AI Integration (COMPLETED)**
  * `ai-service` integrates Google Gemini APIs to run RAG pipelines and powers the **Analytics Copilot** inside `md-portal` to convert natural query text into valid MongoDB pipeline aggregates.

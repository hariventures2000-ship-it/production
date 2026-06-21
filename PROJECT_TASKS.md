# Mervi Platform — Project Roadmap & Task List

This document outlines the implementation ideas and concrete tasks for the remaining phases of the Mervi Enterprise Multi-Tenant SaaS platform.

## Phase 3: Project Management & Workforce Operations
**Target Audience**: Managing Directors (MD) and Team Leads
**Goal**: Allow MDs to oversee projects and Team Leads to manage day-to-day operations, task assignment, and project-level leaves.

### Implementation Ideas
- **Service Segregation**: Build a standalone `project-service` that handles Projects, Milestones, and Tasks. 
- **Database Strategy**: A new `mervi_project_db` MongoDB database, shared by `project-service` and `teamlead-service`.
- **Event-Driven Workflows**: When a task is completed, publish a Kafka event. If all tasks in a milestone are completed, the `project-service` automatically updates the milestone status.
- **Portals**: 
  - `apps/md-portal`: High-level dashboard showing project health, budget utilization, and cross-department workforce metrics.
  - `apps/teamlead-portal`: Operational dashboard to assign tasks to employees and approve project-specific leave requests.

### Tasks
- [ ] Create `mervi-project-service` backend module
  - [ ] Define `Project`, `Milestone`, and `Task` document models
  - [ ] Implement CRUD operations and state transition logic
- [ ] Create `mervi-md-service` and `mervi-teamlead-service` backend modules
  - [ ] Implement endpoints for MD project oversight
  - [ ] Implement endpoints for Team Lead task assignment and team leave approvals
- [ ] Update `mervi-api-gateway`
  - [ ] Add routing for `/api/v1/projects`, `/api/v1/md`, and `/api/v1/teamlead`
  - [ ] Update RBAC matrix in gateway filters
- [ ] Create Next.js Frontend Portals
  - [ ] Scaffold `apps/md-portal` and `apps/teamlead-portal`
  - [ ] Build MD Dashboard (Project health, resource allocation)
  - [ ] Build Team Lead Dashboard (Task board, team overview, leave approvals)

---

## Phase 4: Client Portal
**Target Audience**: External Clients
**Goal**: Provide a secure, read-only view of project progress, invoicing, and a ticketing system for client support.

### Implementation Ideas
- **Strict Isolation**: The `client-service` must enforce strict tenant AND project-level isolation. Clients should only see data explicitly linked to their `clientId`.
- **Ticketing System**: Simple Jira-like board where clients can open support tickets or report bugs.
- **Invoicing**: A lightweight module to generate PDF invoices based on project milestones (using a Java PDF library like iText or Apache PDFBox).

### Tasks
- [ ] Create `mervi-client-service` backend module
  - [ ] Define `ClientProfile`, `Invoice`, and `SupportTicket` document models
  - [ ] Implement secure endpoints for clients to retrieve their data
- [ ] Update `mervi-api-gateway`
  - [ ] Add routing for `/api/v1/client-portal`
  - [ ] Configure strict RBAC for `Role.CLIENT`
- [ ] Create Next.js Frontend Portal
  - [ ] Scaffold `apps/client-portal`
  - [ ] Build Client Dashboard (Project timeline, active tickets, outstanding invoices)
  - [ ] Build Support Ticket creation form and messaging thread UI

---

## Phase 5: Analytics & Notifications
**Target Audience**: Super Admin, MDs, Employees
**Goal**: Provide cross-service data aggregation and real-time asynchronous notifications.

### Implementation Ideas
- **CQRS & Event Sourcing**: The `analytics-service` will subscribe to Kafka topics (e.g., `EMPLOYEE_ONBOARDED`, `PROJECT_COMPLETED`, `INVOICE_PAID`) and build read-optimized materialised views in its own database for fast dashboard rendering.
- **Unified Notification Hub**: The `notification-service` consumes events and dispatches them via Email (JavaMailSender) or WebSocket to the frontends.

### Tasks
- [ ] Create `mervi-analytics-service` backend module
  - [ ] Setup Kafka consumers for domain events
  - [ ] Build aggregation pipelines in MongoDB
  - [ ] Expose read-only analytics endpoints for the MD and Super Admin portals
- [ ] Create `mervi-notification-service` backend module
  - [ ] Implement email templating engine (Thymeleaf or Freemarker)
  - [ ] Implement WebSocket endpoints for real-app in-app notifications
- [ ] Update Frontend Portals
  - [ ] Wire up real-time notification bells in the navigation bars
  - [ ] Add rich charts (using Recharts or Chart.js) to the MD and Super Admin dashboards

---

## Phase 6: AI Integration
**Target Audience**: All internal users
**Goal**: Integrate Generative AI to improve productivity and provide deep insights.

### Implementation Ideas
- **HR Assistant**: AI chatbot in the Employee Portal to answer HR policy questions.
- **Analytics Copilot**: AI integration in the MD portal that can translate natural language queries into MongoDB aggregations ("Show me the budget utilization for Q3 across all design projects").

### Tasks
- [ ] Create `mervi-ai-service` backend module
  - [ ] Integrate with Google GenAI / Gemini APIs
  - [ ] Implement RAG (Retrieval-Augmented Generation) pipeline using Spring AI
- [ ] Update Frontend Portals
  - [ ] Add Chatbot UI component to the Mervi design system
  - [ ] Implement the Analytics Copilot input box in the MD Portal

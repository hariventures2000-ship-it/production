# SLA & SLO Monitoring Framework

## Service Level Objectives (SLOs)
* **Uptime:** 99.9% availability for the primary API.
* **Latency:** 95th percentile (P95) latency < 250ms for core client requests.
* **Support Response:** Initial ticket response time < 4 business hours.

## Incident Priorities
* **P1 (Critical):** Core system offline or major security breach. Alerts fired directly to CEO/MD. Resolution expectation: < 2 hours.
* **P2 (High):** Specific major subsystem failed (e.g. AI engine, Payments). Resolution expectation: < 12 hours.
* **P3 (Medium):** Non-critical bug affecting localized user experiences. Resolution: Next sprint.
* **P4 (Low):** UI/UX glitch or cosmetic defect. Resolution: Backlog.

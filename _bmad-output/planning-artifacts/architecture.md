---
stepsCompleted: [1, 2]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - user-management/project-context.md
  - user-management/PROJECT_DOCUMENTATION.md
  - user-management/README.md
workflowType: 'architecture'
project_name: 'BMAD'
user_name: 'Ninhnt'
date: '2026-04-20'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product defines 38 capabilities across eight major areas: user lifecycle, identity integrity, role governance, authentication/access control, admin operations, recovery workflows, auditability, and integration readiness. Architecturally, this implies a policy-centric core domain where state transitions are first-class and every write path must enforce shared validation and authorization rules. The breadth of FR coverage indicates a modular architecture with clear boundaries between identity lifecycle orchestration, policy enforcement, operational administration, and integration interfaces.

**Non-Functional Requirements:**
Architecture is strongly shaped by five NFR vectors: performance (sub-3s p95 core flows), security (strict authorization plus token controls), scalability (10x internal growth without correctness regression), accessibility (keyboard-operable critical flows), and integration reliability (stable machine-readable contracts). These require consistency-focused design over feature novelty, with centralized control points for validation, access decisions, and error semantics.

**Scale and Complexity:**
This is a medium-complexity brownfield modernization effort rather than a net-new greenfield build. Existing functionality is substantial, but the core architectural lift is to eliminate integrity drift and permission inconsistency across all lifecycle operations.

- Primary domain: Internal reliability-first web admin platform
- Complexity level: Medium
- Estimated architectural components: 8-10 major components/capability modules

### Technical Constraints and Dependencies

Current stack and constraints indicate:
- Spring Boot (Java 21) monolith baseline with Spring Security and JDBC.
- In-memory H2 currently used; persistence strategy must be upgraded for production durability.
- JWT-based auth with current client-side token storage pattern; security posture needs tightening in target architecture.
- Existing endpoint and UI patterns should be evolved, not discarded, to preserve delivery continuity.
- Brownfield migration path should prioritize compatibility and controlled change sequencing over disruptive rewrites.

### Cross-Cutting Concerns Identified

- Centralized validation policy enforcement for all state-changing operations.
- Deterministic role/permission transition governance with explicit conflict handling.
- Unified authorization behavior across UI, API, and future integration channels.
- End-to-end auditability of lifecycle and permission changes.
- Consistent, actionable error contract for admins, support, and integrations.
- Operational observability for integrity anomalies, policy violations, and incident triage.

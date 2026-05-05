---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-identify-targets', 'step-03-generate-tests', 'step-03c-aggregate']
lastStep: 'step-03c-aggregate'
lastSaved: '2026-05-05'
inputDocuments:
  - D:/bmad-project/_bmad/tea/config.yaml
  - D:/bmad-project/user-management/project-context.md
  - D:/bmad-project/user-management/package.json
  - D:/bmad-project/user-management/pom.xml
  - D:/bmad-project/user-management/playwright.config.ts
  - D:/bmad-project/user-management/src/test/java/com/example/management/ApplicationTests.java
  - D:/bmad-project/user-management/src/test/java/com/example/management/AuthenticationTest.java
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/tea-index.csv
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/test-levels-framework.md
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/test-priorities-matrix.md
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/data-factories.md
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/selective-testing.md
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/ci-burn-in.md
  - D:/bmad-project/.agents/skills/bmad-testarch-automate/resources/knowledge/test-quality.md
---

# Step 1 - Preflight and Context

## Stack and Framework Detection

- `test_stack_type` in config: `auto`
- Detected stack: `fullstack`
  - Frontend indicators found: `user-management/package.json`, `user-management/playwright.config.ts`
  - Backend indicators found: `user-management/pom.xml`, `user-management/src/test/...`
- Framework readiness: **PASS**
  - UI/E2E framework exists (Playwright configured)
  - Backend test scaffold exists (`src/test/java`)

## Execution Mode

- Mode: **Standalone**
- Reason: No active BMad story/spec/test-design artifacts found for this target implementation scope.

## TEA Config Flags (Read)

- `tea_use_playwright_utils: true`
- `tea_use_pactjs_utils: false`
- `tea_pact_mcp: none`
- `tea_browser_automation: auto`
- `test_stack_type: auto`

## Knowledge Fragments Loaded (Core)

- `test-levels-framework.md`
- `test-priorities-matrix.md`
- `data-factories.md`
- `selective-testing.md`
- `ci-burn-in.md`
- `test-quality.md`

## Existing Test Surface Snapshot

- E2E tests: `user-management/tests/e2e/*.spec.ts` (home, signup, login, dashboard, access-control)
- Backend tests: `user-management/src/test/java/...` (application and auth tests)

## Preflight Conclusion

Preflight passed. Proceed to Step 2 (`step-02-identify-targets`) to select automation targets and prioritize P0/P1 test expansion.

# Step 2 - Identify Automation Targets

## Target Discovery (Standalone Mode)

- Scope analyzed: `user-management` fullstack app (Spring Boot backend + Playwright E2E UI)
- Existing coverage found:
  - UI flows: login, signup, home, dashboard, access-control
  - Backend auth tests: register/authenticate validation and some admin operations
- No OpenAPI/Swagger contract files found.

## Candidate Targets and Gaps

### E2E Targets (Critical Journeys)

- **Auth lifecycle hardening**: register -> authenticate -> logout -> protected-route redirect.
  - Gap: explicit token revocation verification after logout is partial.
- **Admin governance journey**: admin promote user -> user gains dashboard access.
  - Gap: promotion effect is not fully asserted end-to-end.
- **Security boundary checks**: non-admin direct calls to admin mutation actions.
  - Gap: route-level denial is partly covered in UI but not comprehensively across admin mutations.

### API/Integration Targets

- **`POST /api/v1/auth/register`**:
  - Missing matrix for malformed JSON, unsupported chars, and duplicate username race cases.
- **`POST /api/v1/auth/authenticate`**:
  - Missing cases for locked/disabled/unknown account behavior (if implemented), plus response shape assertions.
- **`GET /api/v1/auth/logout`**:
  - Missing deterministic checks for JWT invalidation effects across protected endpoints.
- **`POST /make-admin/{email}` and `DELETE /delete/{user}`**:
  - Missing role-based authorization matrix and idempotency/error contracts at API level.

### Unit/Component Targets

- **Service-level validation logic** behind auth/admin controllers.
  - Gap: little isolated unit coverage for edge-case branches and normalization rules.
- **Dashboard client-side filtering and modal rendering logic**.
  - Gap: currently covered through E2E, but no lighter component-level checks for brittle UI behavior.

## Selected Test Levels

- **E2E**: retain for top user journeys and cross-layer auth/authorization outcomes.
- **API integration**: primary expansion area for auth/admin contracts and security responses.
- **Unit**: add focused checks for pure validation/normalization branches.
- **Component**: optional for UI filtering/modal behavior if frontend extraction is feasible.

## Priority Assignment

- **P0**
  - Auth register/authenticate/logout contract and security outcomes
  - Admin-only mutation protections (`delete`, `make-admin`)
- **P1**
  - Dashboard data consistency and promote-user reflected permissions
  - Key negative flows for invalid credentials and duplicate identities
- **P2**
  - UI modal/detail view robustness and non-critical edge display states
- **P3**
  - Cosmetic or rarely-used UI states

## Coverage Plan (Concise)

- **Critical-path scope** (P0/P1 first):
  - API integration suite for auth/admin endpoints with deterministic assertions
  - E2E suite for role escalation + access-control regression paths
- **Selective deepening**:
  - Add unit tests for pure validation branches
  - Add component-level checks only where E2E flakiness/debug cost is high
- **Duplicate-coverage guard**:
  - Keep business-rule permutations at API/unit level
  - Keep only user-visible critical flows in E2E

Proceed to Step 3 (`step-03-generate-tests`) to generate prioritized tests and fixture recommendations.

# Step 3 - Concrete Test Set Generation

## Execution Mode Resolution

- Requested: `auto` (from config)
- Probe Enabled: `true`
- Supports subagent: `true`
- Supports agent-team: `false` (not available in this run)
- Resolved mode: `subagent`
- Stack type: `fullstack`

## Worker Dispatch and Completion

- Subagent A (API): complete
- Subagent B (E2E): complete
- Subagent B-backend (Backend): complete
- Output contract validated and aggregated below.

## Concrete Test Set

### API Integration Tests (10)

1. `API-P0-001` `@api @p0 @auth @lifecycle`  
   Register -> authenticate -> logout -> re-authenticate lifecycle remains stable.
2. `API-P0-002` `@api @p0 @auth @negative`  
   Duplicate registration is blocked with deterministic 400 + duplicate message.
3. `API-P0-003` `@api @p0 @auth @negative`  
   Wrong password returns 401 and never issues token.
4. `API-P0-004` `@api @p0 @admin @authorization`  
   Non-admin cannot `DELETE /delete/{user}` and target remains.
5. `API-P0-005` `@api @p0 @admin @authorization`  
   Admin delete succeeds once; second delete returns not found/idempotent behavior.
6. `API-P0-006` `@api @p0 @admin @authorization @security`  
   Anonymous/non-admin access to `POST /make-admin/{email}` is denied.
7. `API-P0-007` `@api @p0 @admin @authorization`  
   Admin promotion succeeds and role change is observable.
8. `API-P1-008` `@api @p1 @auth @validation`  
   Empty password in authenticate returns 400 with validation payload.
9. `API-P1-009` `@api @p1 @auth @validation`  
   Weak/whitespace passwords rejected in register flow.
10. `API-P2-010` `@api @p2 @auth @data-consistency`  
    Email normalization handles uppercase/canonical login consistency.

### E2E Tests (8)

1. `E2E-P0-001` `@e2e @p0 @security @access-control`  
   Prevent self-role escalation via UI/API tampering.
2. `E2E-P0-002` `@e2e @p0 @security @idor`  
   Block IDOR access to other users' records/actions.
3. `E2E-P0-003` `@e2e @p0 @auth @logout`  
   Logout revokes session across tabs and back-navigation.
4. `E2E-P0-004` `@e2e @p0 @auth @session-revocation`  
   Password change invalidates old sessions/tokens.
5. `E2E-P1-005` `@e2e @p1 @access-control @routing`  
   Non-admin deep-link attempts to nested admin routes are denied.
6. `E2E-P1-006` `@e2e @p1 @rbac @session-consistency`  
   Mid-session role downgrade removes admin power consistently.
7. `E2E-P1-007` `@e2e @p1 @journey @onboarding`  
   New-user signup -> first protected action -> logout denial path.
8. `E2E-P1-008` `@e2e @p1 @auth @race-condition`  
   Concurrent login/logout race does not keep stale authorized session.

### Backend Unit/Integration Tests (8)

1. `BE-P0-001` `@backend @p0 @normalization @unit`  
   `RegisterRequest` trims and normalizes username/name/password.
2. `BE-P0-002` `@backend @p0 @normalization @unit`  
   `AuthRequest` normalization is deterministic.
3. `BE-P0-003` `@backend @p0 @integration @validation`  
   Register duplicate user returns stable 400 duplicate contract.
4. `BE-P0-004` `@backend @p0 @integration @auth`  
   Bad credentials map to unauthorized branch and no token.
5. `BE-P0-005` `@backend @p0 @integration @authorization`  
   Non-admin token forbidden on protected delete endpoint.
6. `BE-P1-006` `@backend @p1 @unit @service-branch`  
   `AppService.makeAdmin` lowercases input and updates authorities.
7. `BE-P1-007` `@backend @p1 @unit @service-branch`  
   `makeAdmin` not-found branch throws and skips update.
8. `BE-P1-008` `@backend @p1 @integration @controller`  
   `POST /make-admin/{email}` escapes reflected path content in response.

## Fixture Recommendations

### Shared API/Auth Fixtures

- `authUserFactory` (factory): deterministic user payload generation.
- `adminSessionHelper` (helper): obtain reusable admin bearer token safely.
- `roleAssertFixture` (fixture): verify role transitions before/after promotion.
- `userCleanupHelper` (helper): delete/reset disposable users and roles.

### E2E Fixtures and Helpers

- `authStateByRole` (fixture): pre-auth browser states for admin/user.
- `seedUsersAndRoles` (helper): API seeding for multi-user role scenarios.
- `sessionControlHelper` (helper): revoke/assert session validity across tabs.
- `securityAssertions` (helper): standardized 401/403/404 policy assertions.
- `AdminPages` (page-object): privileged route/action abstraction.

### Backend Fixtures and Helpers

- `UserFactory` (factory): role variants + mixed-case username variants.
- `AuthPayloadFixture` (fixture): canonical valid/invalid auth payloads.
- `JwtTestHelper` (helper): robust token extraction/assertion helper.
- `IsolatedH2Profile` (helper): per-test DB isolation/reset for parallel stability.

## Priority Tags and Execution Strategy

- **Smoke (push/fast gate, ~5 min):**
  - API: `API-P0-001`, `API-P0-003`, `API-P0-004`, `API-P0-006`
  - E2E: `E2E-P0-001`, `E2E-P0-003`
  - Backend: `BE-P0-003`, `BE-P0-005`
- **PR Gate (~10-20 min, block merge):**
  - Run all `P0` + selected `P1` (`E2E-P1-005`, `E2E-P1-007`, `API-P1-008`, `BE-P1-006`)
  - Parallel shards by level (`api`, `e2e`, `backend`) with fail-fast.
- **Nightly / pre-release (full confidence):**
  - Run all generated tests (`P0-P2`) + repeat race/revocation tests to detect flakiness.
  - Capture traces/artifacts and enforce cleanup drift checks.

## Performance Report

- Execution mode: `subagent`
- API generation: complete
- E2E generation: complete
- Backend generation: complete
- Estimated parallel gain vs sequential drafting: ~40-60%

# Step 3C - Implementation-Ready Pack

## Recommended Naming and Folder Placement

### Playwright E2E Layer

- Keep E2E specs under `user-management/tests/e2e/` with kebab-case feature names.
- Keep page objects under `user-management/tests/pages/` with PascalCase class/file names.
- Keep fixtures/helpers under `user-management/tests/fixtures/` with `*.fixture.ts` for Playwright fixtures and `*.helper.ts` for utility helpers.

### Java Backend Test Layer

- Keep Java tests under `user-management/src/test/java/com/example/management/`.
- Use package split by concern:
  - `.../auth/` for auth endpoint/service integration
  - `.../app/` for admin/app service tests
  - `.../validation/` for request normalization/validation unit tests
- Naming convention:
  - Unit: `<ClassName>Test.java`
  - Integration (MockMvc): `<FeatureName>IntegrationTest.java`

## File-by-File Scaffolds (Create/Update Plan)

### A) E2E - CREATE

1. `user-management/tests/e2e/security-hardening.spec.ts`  
   - **Purpose:** P0 privilege escalation + IDOR + deep-link admin denial scenarios.  
   - **Scaffold blocks:** `test.describe('Security hardening')`, shared setup via existing `auth.fixture`, scenario tags (`@e2e @p0 @security`).

2. `user-management/tests/e2e/session-revocation.spec.ts`  
   - **Purpose:** P0 logout multi-tab revocation + P0 password-change invalidates old session + P1 race condition.  
   - **Scaffold blocks:** multi-context helper usage, protected-route assertions, token-storage assertions.

3. `user-management/tests/e2e/onboarding-critical-journey.spec.ts`  
   - **Purpose:** P1 signup -> first protected action -> logout denial journey.  
   - **Scaffold blocks:** deterministic test data creation, minimal happy-path + post-logout guard assertions.

### B) E2E - UPDATE

4. `user-management/tests/fixtures/auth.fixture.ts`  
   - **Add fixture scaffolds:**
     - `seedUsersAndRoles` helper fixture handle
     - `sessionControl` helper fixture handle
     - optional `pageAsAdminFresh` / `pageAsUserFresh` for strict isolation tests
   - **Reason:** keep new specs concise and consistent with current fixture style.

5. `user-management/tests/pages/HomePage.ts`  
   - **Add methods:** explicit `gotoDashboardRouteDirect()`, `expectUnauthorizedRedirect()`.

6. `user-management/tests/pages/DashboardPage.ts`  
   - **Add methods:** `expectAdminOnlyControlsHidden()`, `attemptAdminActionAndCaptureStatus()`.

7. `user-management/tests/pages/LoginPage.ts`  
   - **Add methods:** `logoutViaUi()`, `expectAtLoginScreen()`.

### C) E2E Helpers/Factories - CREATE

8. `user-management/tests/fixtures/user-data.factory.ts`  
   - **Purpose:** deterministic email/name/password factories for E2E/API cross-use.

9. `user-management/tests/fixtures/session-control.helper.ts`  
   - **Purpose:** create/reuse/revoke session helpers for multi-tab and race tests.

10. `user-management/tests/fixtures/security-assertions.helper.ts`  
    - **Purpose:** common assertions for 401/403/404 and no-data-leak checks.

### D) API Integration (Playwright APIRequestContext) - CREATE

11. `user-management/tests/api/auth-lifecycle.api.spec.ts`  
    - **Purpose:** P0 register/authenticate/logout contract and token presence checks.

12. `user-management/tests/api/auth-validation.api.spec.ts`  
    - **Purpose:** P1 invalid payload matrix (empty/short/whitespace) + duplicate registration.

13. `user-management/tests/api/admin-authorization.api.spec.ts`  
    - **Purpose:** P0 admin-only enforcement for `DELETE /delete/{user}` and `POST /make-admin/{email}`.

14. `user-management/tests/api/normalization.api.spec.ts`  
    - **Purpose:** P2 uppercase/lowercase email normalization behavior.

15. `user-management/tests/fixtures/api-auth.helper.ts`  
    - **Purpose:** token acquisition helpers (admin/user), avoiding brittle token parsing repetition.

### E) Backend Unit/Integration (JUnit + MockMvc) - CREATE

16. `user-management/src/test/java/com/example/management/validation/RegisterRequestTest.java`  
    - **Purpose:** P0 normalization unit tests for register DTO/request model.

17. `user-management/src/test/java/com/example/management/validation/AuthRequestTest.java`  
    - **Purpose:** P0 normalization unit tests for auth DTO/request model.

18. `user-management/src/test/java/com/example/management/auth/AuthControllerIntegrationTest.java`  
    - **Purpose:** P0/P1 integration checks for register/authenticate negative contracts.

19. `user-management/src/test/java/com/example/management/app/AdminAuthorizationIntegrationTest.java`  
    - **Purpose:** P0 role authorization checks for delete/make-admin endpoints.

20. `user-management/src/test/java/com/example/management/app/AppServiceTest.java`  
    - **Purpose:** P1 `makeAdmin` service branch tests (success + not found).

### F) Backend Test Utilities - CREATE

21. `user-management/src/test/java/com/example/management/support/TestUserFactory.java`  
    - **Purpose:** deterministic in-memory user objects and role variants.

22. `user-management/src/test/java/com/example/management/support/JwtTestHelper.java`  
    - **Purpose:** token extraction/authorization-header helper for MockMvc tests.

23. `user-management/src/test/java/com/example/management/support/DatabaseResetHelper.java`  
    - **Purpose:** isolate DB state per test class/method to reduce cross-test pollution.

## Suggested Minimal Scaffold Skeletons Per New File

- **Spec file skeleton (`*.spec.ts` / `*.api.spec.ts`):**
  - imports from `../fixtures/auth.fixture` or dedicated api helper
  - `test.describe('<feature>')`
  - tagged `test('<scenario> @p0 @e2e', async (...) => { ... })`
  - explicit assertions + deterministic cleanup

- **Fixture/helper skeleton (`*.fixture.ts` / `*.helper.ts`):**
  - typed exported functions/fixtures only
  - no hidden assertions; assertions stay in spec files
  - predictable naming (`createX`, `seedX`, `expectXPolicyDenied`)

- **Java test skeleton (`*Test.java` / `*IntegrationTest.java`):**
  - unit tests: pure JUnit + assertions, no Spring context unless required
  - integration: `@SpringBootTest` + `@AutoConfigureMockMvc`
  - helper methods for payload builders and token acquisition

## Priority-to-File Mapping (Implementation Order)

1. **P0 first:** files 1, 2, 11, 13, 16, 17, 18, 19  
2. **P1 second:** files 3, 12, 20  
3. **P2 last:** file 14  
4. **Support infra before heavy implementation:** files 8, 9, 10, 15, 21, 22, 23

## Aggregation Output Summary

- Stack type: `fullstack`
- Implementation pack prepared with exact create/update map
- Placement aligns with current project conventions (`tests/e2e`, `tests/pages`, `tests/fixtures`, `src/test/java/...`)
- Ready for Step 4 validation after scaffolds are materialized.

---
name: react-js-ts-expert
description: 'Use when building, refactoring, or reviewing React + JavaScript + TypeScript code. Triggers: react component, hooks, typescript types, state management, accessibility, performance, testing, code review, frontend architecture, bugfix.'
argument-hint: 'Task + constraints. Example: Build searchable question list with keyboard navigation and tests.'
user-invocable: true
---

# React JavaScript TypeScript Expert

## What This Skill Produces
- Production-ready React/TS implementation plans and code changes.
- Structured technical decisions for architecture, state, typing, and component boundaries.
- Review findings focused on correctness, regressions, accessibility, performance, and test quality.
- A completion checklist that verifies behavior and code quality before sign-off.

## When To Use
- New feature development in React + TS.
- Refactoring legacy JavaScript or weakly typed React code.
- Component design, custom hooks, and state management decisions.
- Performance tuning and rendering optimization.
- PR reviews for frontend behavior and maintainability.

## Inputs To Collect First
1. Product goal and user-facing behavior.
2. Constraints: deadlines, browser support, package policy, coding standards.
3. Existing patterns in the repository (state, styling, testing, folder conventions).
4. Definition of done: tests, accessibility level, performance expectations.

## Workflow

### 1. Frame The Problem
1. Restate expected behavior in concrete terms.
2. Identify risky areas: async flows, shared state, form handling, heavy rendering.
3. Define acceptance criteria in testable language.

Quality gate:
- The behavior can be validated with explicit happy-path and edge-case checks.

### 2. Choose Architecture And Boundaries
1. Split by responsibilities:
- Presentational components: rendering and UI-only logic.
- Container/feature logic: orchestration, data loading, state transitions.
- Hooks: reusable logic with stable and typed API.
2. Keep components small and composable.
3. Prefer explicit props contracts over deep implicit dependencies.

Decision points:
- If state is local and shallow, use component state.
- If state is medium complexity or shared across siblings/routes, allow an external store early (follow existing project convention first).
- If logic is reused across multiple components, extract a custom hook.

Quality gate:
- Every module has one clear responsibility and minimal coupling.

### 3. Type Design First (TypeScript)
1. Model domain data with focused types/interfaces.
2. Use discriminated unions for variant states (loading/success/error).
4. Avoid `any` and avoid type assertions/casts; use `unknown` + narrowing when needed.
5. Type component props and hook returns explicitly when inference is unclear.
6. Encode nullable/optional fields intentionally.

Decision points:
- If an entity has lifecycle states, prefer union types over many booleans.
- If utility behavior depends on input shape, prefer generics with constraints.

Quality gate:
- No unsafe escapes (`any`, broad casts, non-null assertions) in production code.

### 4. Implement React Logic Safely
1. Keep render functions pure and side effects in `useEffect`.
2. Derive data instead of duplicating state.
3. Use functional updates when next state depends on previous state.
4. Prevent stale closures by correct dependency arrays.
5. Isolate async logic and handle cancellation/race conditions where relevant.

Decision points:
- If computed values are expensive and dependencies stable, use `useMemo`.
- If callback identity matters for child rendering, use `useCallback`.
- If memoization adds complexity without measurable value, do not add it.

Quality gate:
- No effect-driven infinite loops, stale data bugs, or avoidable double state sources.

### 5. UI, Accessibility, And UX
1. Use semantic HTML before ARIA.
2. Ensure keyboard navigation and visible focus states.
3. Provide accessible labels and names for interactive controls.
4. Handle loading, empty, and error states explicitly.
5. Keep content and interactions responsive on common screen sizes.

Quality gate:
- Core flow works with keyboard-only navigation and screen-reader-friendly labeling.

### 6. Performance Checks
1. Profile before optimizing.
2. Avoid unnecessary re-renders by stabilizing props and lifting expensive computation.
3. Use list virtualization for large collections when needed.
4. Debounce/throttle high-frequency handlers where appropriate.
5. Lazy-load heavy modules/routes when beneficial.

Quality gate:
- Optimizations are evidence-based, not speculative.

### 7. Testing Strategy
1. Test behavior over implementation details.
2. Add unit tests for pure utilities and hooks with branching logic.
3. Use Vitest + React Testing Library for component tests focused on user interactions and visible outcomes.
4. Cover failure paths: API errors, invalid input, empty data.
5. Keep fixtures minimal and deterministic.

Decision points:
- If behavior crosses multiple components, prefer integration-style tests.
- If logic is pure and isolated, prefer focused unit tests.

Quality gate:
- Tests cover happy path, at least one edge case, and one failure path.

### 8. Expert Review Pass (Before Merge)
1. Correctness:
- Verify output and state transitions match requirements.
2. Type safety:
- Check for weak typing, unsafe assertions, and nullable hazards.
3. React reliability:
- Review effects, dependencies, derived state, and event handlers.
4. Accessibility:
- Validate labels, roles, focus order, and keyboard support.
5. Performance:
- Spot unnecessary renders and heavy computations in render path.
6. Maintainability:
- Naming clarity, module boundaries, and dead-code elimination.
7. Test quality:
- Ensure tests assert behavior, not internals.

Review output format:
- Findings first, ordered by severity.
- Each finding includes location, impact, and recommended fix.
- Note testing gaps and residual risk.

## React + JS/TS Best Practices Checklist
- Types model the domain, not the current API accident.
- Components are small, composable, and purpose-driven.
- Hooks expose clean API and hide implementation details.
- State is minimal; derived values are computed, not duplicated.
- Effects are intentional and dependency-correct.
- Accessibility is included by default, not retrofitted.
- Performance tuning is measured and justified.
- Tests represent user behavior and critical branches.

## Anti-Patterns To Avoid
- `any`-heavy code and unbounded type assertions.
- Prop drilling across many levels when composition/context fits better.
- Mirroring props to state without a strict reason.
- Overusing memoization everywhere.
- Logic hidden in JSX expressions that reduces readability.
- Tests tightly coupled to implementation internals.

## Done Criteria
A task is complete only when:
1. Functional requirements are met for normal and edge scenarios.
2. Types are strict enough to prevent common runtime mistakes.
3. Accessibility checks pass for core interactions.
4. Performance is acceptable for expected data sizes.
5. Automated tests are present and pass.
6. Review findings are resolved or explicitly documented.

---
description: Code Review Quality Control Workflow for TypeScript code in the WRAP project
---

# Code Review Quality Control Workflow

Use this workflow to review TypeScript code for the WRAP project. Apply every rule below as a hard gate — flag any violation as a blocking issue. For each issue found, quote the offending lines and state which rule they violate.

**Complete workflow sequence:** This is step 2 of 4 in the complete PR creation process. Always use after jira-issue-management workflow and before pull-request-management workflow to ensure code quality standards are met.

## Steps

1. **Review TypeScript Strictness**
   - No `any` — not in source, not in tests, not in casts
   - No `!` (non-null assertion) — use `isNil` / optional chaining / explicit guard clauses instead
   - No `@ts-ignore` or `@ts-expect-error`
   - `type` not `interface` — `interface` has structural side-effects; always use `type Foo = { ... }`
   - No relative imports — always `@/...` path aliases. Exception: barrel `index.ts` files may use relative imports for re-exports

2. **Check Type Cast Placement**
   - Type casts with `as` must happen on assignment or creation, never at the point of use
   - **When a cast is needed at point of use, create a new type definition** that returns the correct type by design, eliminating the need for casts
   - Prefer proper type definitions over runtime type checks; only use guard clauses when runtime validation is genuinely needed, not just to satisfy TypeScript
   - A cast is only acceptable when the type system genuinely cannot infer a type that is known at runtime

3. **Validate Type Design Process**
   - Types should be designed bottom-up:
     1. Start from the concrete leaf values (what a field actually holds at runtime)
     2. Write out all possible variant types explicitly — don't shortcut
     3. Combine them into the union / mapped type
     4. Only then simplify by collapsing repeated patterns
   - Red flag: a type that was clearly written top-down (e.g., immediately wraps everything in `Partial<>` or uses `unknown` without thought) and skips the simplification step

4. **Check Cyclomatic Complexity**
   - Each function or method should have at most one level of conditional nesting in its main body
   - Use guard clauses (early returns) to flatten logic
   - Each guard clause must be followed by a blank line before the next statement

5. **Verify Test Completeness**
   - Every test must include explicit Arrange / Act / Assert comments and be fully self-contained
   - No shared state from `beforeEach` unless it is truly invariant setup (e.g., DB reset)
   - Service test assertions should target database state, not service return values, unless the return value is specifically what is under test
   - Spy assertions — use `expect(spy).not.toHaveBeenCalled()` without arguments. Never use `not.toHaveBeenCalledWith(...)`

6. **Ensure One Expect Per Test**
   - Consolidate assertions into a single `expect` using `expect.objectContaining`
   - Exceptions: tests that assert something did NOT happen (e.g., `not.toHaveBeenCalled()`, `not.toBe()`) may be standalone single-line expects
   - When asserting "not any of N values", split into N separate tests rather than looping

7. **Check Test Naming**
   - Tests must follow `"when [condition], [expected behaviour]"` with full English words (no abbreviations)
   - Numbered entities in test bodies: `user1`, `user2`, `workflowStep1`, `workflowStep2` — never `existingUser`, `newUser`
   - Describe hierarchy must mirror the source file path

8. **Validate Error Messages**
   - `expect(bool).toBe(true)` is never acceptable — a failing test must tell you what went wrong without reading the source
   - Split complex boolean assertions into individual named assertions

9. **Review fishery-bot Factory Conventions**
   - `beforeCreate` is for FK-dependent attribute computation — it receives the fully-typed model instance with associations already created and FKs set
   - `lazy()` is for attribute values derived from other attributes in the same generator return, without needing the model instance
   - `afterCreate` is for post-save side-effects (e.g., creating related records that require a saved ID)
   - `beforeCreate` does not run during `build()` — this is correct and intentional
   - Generator functions must not use `as` on `resolvedParams` values — use `typeof` guards or `isNil` to narrow instead

10. **Check Architecture Consistency**
    - When multiple classes serve similar purposes, ensure they have consistent APIs and clear differentiation in their type signatures
    - **When extending functionality, create new types rather than modifying existing ones to avoid breaking changes**
    - **Ensure similar classes follow the same patterns** (e.g., both AttributeEvaluator and AttributeBuilder should have similar method signatures)
    - Flag inconsistent naming or patterns between similar classes

11. **Check for Over-Engineering**
    - Flag additions that were not requested:
      - New abstractions, helpers, or utilities for a one-time use
      - Features, flags, or configurability that no current caller needs
      - Comments explaining what the code does when the names already say it
      - Error handling for states that cannot be reached

12. **Check for Orphaned or Non-Sensical Code**
    - Flag functions, methods, or code paths that serve no purpose
    - Look for placeholder implementations that never get called
    - Identify dead code paths or unreachable logic
    - Check for no-op functions that exist but do nothing meaningful
    - **Flag code with comments like "legacy path" or "no-op here" that should be removed**
    - **Look for types that are exported but never used anywhere in the codebase**
    - **When removing features, remove all related types, imports, and exports** - don't leave partially implemented type systems
    - Verify that all exported functions are actually used somewhere in the codebase

13. **Validate Import Organization**
    - Imports must follow PEP 8-style grouping with a blank line between each group:
      1. Node.js built-ins (`path`, `fs`, etc.)
      2. External packages from `node_modules`
      3. Internal imports from `@/`
    - Within each group, alphabetical ordering is required. One import statement per module

14. **Check Naming Conventions**
    - No abbreviations — `workflow` not `wf`, `migration` not `mig`, `workflowStep` not `step`
    - Fully qualified names at public boundaries — when data crosses a boundary (API response, email template, event payload), prefix with the parent model name to disambiguate
    - SQL — fully spell out table and column names; no abbreviated aliases
    - Function names — describe both trigger and behavior

15. **Verify Expanded Style**
    - Avoid terse functional chains. Each logical step must be on its own line or extracted to a named variable
    - Extract and rename before constructing objects — never inline a property rename
    - No chained transformations — break chains at each step
    - Named constants — hoist every magic number or string to a named `const` at the top of the function or file

16. **Check Service Pattern**
    - Services encapsulate business logic and are invoked exclusively via their static `perform()` method
    - Never instantiate a service directly outside of its own `static perform()` implementation
    - Red flags: `new SomeService(...)` at a call site, business logic in a controller that belongs in a service, a service calling a query directly instead of delegating to another service

17. **Check Policy Scope Safety**
    - Policies that are action-only, access-request-only, or not meant for index/relation scoping must fail closed with `NO_RECORDS_SCOPE`
    - Flag `{}` policy scopes unless they are an intentional all-records path, such as an admin early return or a genuinely public scope
    - Polymorphic resources must constrain their target type at the backend boundary; do not rely on frontend callers to send a safe `targetType`

18. **Check Nested Endpoint and Client Shape**
    - Model-specific backend routes should keep their nested domain shape instead of overloading a top-level endpoint for another model
    - Frontend API clients should mirror nested backend routes in matching nested folders and be re-exported as namespaces for the bundled `Api` pattern
    - Flag legacy or model-specific frontend type names when the backend intentionally uses a shared polymorphic model

## Output Format

For each issue:

```
[RULE N] <rule name>
File: <path>:<line>
> <quoted offending code>
Fix: <one-sentence description of what to change>
```

After listing all issues, conclude with one of:

- **APPROVED** — no blocking issues found.
- **CHANGES REQUESTED** — N blocking issues listed above.

## Related Workflows

- [`./jira-issue-management-workflow.md`](./jira-issue-management-workflow.md) - Creating, enhancing, and managing Jira issues
- [`./pull-request-management-workflow.md`](./pull-request-management-workflow.md) - Create and update pull requests with comprehensive testing instructions
- [`./testing-instructions-workflow.md`](./testing-instructions-workflow.md) - Generate comprehensive testing instructions for pull requests

---

**Last Updated:** 2026-06-15

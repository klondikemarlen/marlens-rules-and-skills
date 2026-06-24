# Dashboard Filter Workflow

Add a new filter to the dashboard workflow filters menu.

## Intent

**WHY this workflow exists:** Dashboard filters span 10 layers across backend and frontend. Missing any layer causes silent failures or broken UI. This workflow ensures nothing is missed.

**WHAT this workflow produces:** A working filter dropdown in the dashboard filters menu, synced to URL query params, with proper security scoping.

**Decision Rules:**

- **where vs filters:** If the selected value maps to a direct Workflow column (e.g., `creatorId`), use `where`. If it triggers a Workflow scope (e.g., `waitingOnAnyPlayerReferences`), use `filters`.
- **Scope naming:** Include the parameter type in the name so callers know what to pass (e.g., `upNextOnWorkflowAccessibleByUser` not `upNextOfAccessibleWorkflow`).
- **Search scope:** Use `addNonTypeSafeSearchScopeWithAssociationSupport` with `"association.field"` dot-notation, not raw SQL EXISTS.
- **establishScopes() must be called:** Register in `api/src/models/index.ts` if the model doesn't already have it.
- **Wrapper choice:** Use a single-id route-query wrapper for scalar filters like `creatorId`. Use a JSON-backed multi-reference wrapper only when the filter stores structured references, like `waitingOnAnyPlayerReferences`.
- **Do not revive the old workflow-step-player filter path:** The dashboard menu now uses `FilterUserSearchableAutocomplete` for **Created By** and `FilterWorkflowPlayerReferenceSearchableAutocomplete` for **Waiting On**. Do not add new dashboard filters using the removed workflow-step-player wrapper pattern.

## Concepts

- **Filtered model:** The model the autocomplete searches (e.g., User, PotentialPlayer). Needs a scope to limit results to relevant records.
- **Workflow model:** The model being filtered in the data table (Workflow). The selected value becomes a `where` clause or `filters` scope.
- **Filter type enum:** `DashboardWorkflowFilterTypes` controls visibility per-dashboard via `excludedFilters`.
- **Single-id wrapper:** A route-query wrapper that stores one numeric id using `integerTransformer`.
- **Multi-reference wrapper:** A route-query wrapper that stores arrays of structured references using `jsonTransformer`.

## Steps

### 1. Backend scope on the filtered model

Add a security-boundary scope to the model the autocomplete searches. This limits results to records the current user can see.

**File:** `api/src/models/{filtered-model}.ts`

Pattern: `Op.and` + nested EXISTS subqueries. See `feedback_sequelize_scope_patterns.md`.

If the model needs a search scope, use `addNonTypeSafeSearchScopeWithAssociationSupport`. Search scope always goes first in `establishScopes()`.

Ensure `{Model}.establishScopes()` is called in `api/src/models/index.ts`.

### 2. Frontend API types for the filtered model

Add the scope name to the filtered model's `FiltersOptions` type and ensure a `QueryOptions` type exists.

**File:** `web/src/api/{filtered-model}s-api.ts`

### 3. Composable for the filtered model

Ensure a list composable exists that takes `Ref<QueryOptions>` and re-exports types.

**File:** `web/src/use/use-{filtered-model}s.ts`

**Reference:** `use-users.ts`, `use-potential-players.ts`

### 4. Search autocomplete component

Ensure a searchable autocomplete exists for the filtered model. Accepts a `filters` prop that gets folded into the API query (this triggers the backend scope from step 1).

**File:** `web/src/components/{model-plural}/{Model}SearchableAutocomplete.vue`

**Reference:** `UserSearchableAutocomplete.vue`, `PotentialPlayersSearchableAutocomplete.vue`

### 5. Filter wrapper component

Create a route-query-synced wrapper using the template.

**Template:** `agents/templates/filter-searchable-autocomplete-template.md`

**File:** `web/src/components/common/tables/Filter{Model}SearchableAutocomplete.vue`

Current live patterns:

- **Created By:** single-id wrapper using `integerTransformer` and `route-query-prefix="creator"`
- **Waiting On:** multi-reference wrapper using `jsonTransformer` and `route-query-prefix="waitingOnAny"`

### 6. Dashboard filter type enum

Add an entry to `DashboardWorkflowFilterTypes`.

**File:** `web/src/api/dashboards-api.ts`

### 7. Menu integration

Wire into `DashboardWorkflowFiltersMenu.vue`. Add to template and script:

1. **State ref:** `const newFilterId = ref<number | null>(null)`
2. **Template ref:** `useTemplateRef("filterNewAutocomplete")`
3. **Loaded ref:** `ref(false)`
4. **Filters computed:** Backend scope params, e.g., `computed(() => ({ scopeName: currentUser.value.id }))`
5. **menuFilters entry:** `{ type, value, loaded }`
6. **clearFilters():** add `.clear()` call
7. **watchEffect:** add value to `where` or `filters` output (see decision rule above)
8. **active filter count:** If the filter value is scalar, do not use `isEmpty()` alone to detect whether it is active. Scalars like numbers can be misclassified as empty.

### 8. Bar integration

If the menu now emits `filters` (not just `where`), ensure `DashboardWorkflowFiltersBar.vue` passes `v-model:filters` through.

### 9. Backend scope on Workflow (if using filters path)

Add a scope to the Workflow model matching the key in `WorkflowFiltersOptions`.

**File:** `api/src/models/workflow.ts`

### 10. Frontend Workflow filters type (if using filters path)

Add the scope name to `WorkflowFiltersOptions`.

**File:** `web/src/api/workflows-api.ts`

## Checklist

- [ ] Backend scope on filtered model + `establishScopes()` registered
- [ ] Frontend API types (`FiltersOptions`, `QueryOptions`)
- [ ] List composable with `Ref<QueryOptions>`
- [ ] Search autocomplete component
- [ ] Filter wrapper component (from template)
- [ ] `DashboardWorkflowFilterTypes` enum entry
- [ ] Menu integration (template + 7 script items)
- [ ] Bar integration
- [ ] Dashboard `excludedFilters` updates
- [ ] Workflow scope + `WorkflowFiltersOptions` (if filters path)
- [ ] Wrapper type matches actual filter shape (single id vs structured references)

# Create Admin UI Workflow

Add a complete CRUD-style admin interface for a WRAP resource.

## Intent

**WHY this workflow exists:** Keep admin CRUD work consistent across backend and frontend layers,
reduce boilerplate drift, and avoid missed integration steps.

**WHAT this workflow produces:** A coordinated implementation across:

- Backend: model updates, controller, policy, services, serializers, routes
- Frontend: API client, composables, components, pages, routes

**Decision Rules:**

- Build backend support first, then wire the frontend to it.
- Prefer separate `CreateService`, `UpdateService`, and `DestroyService` classes.
- Keep business logic in services, authorization in policies, and response shaping in serializers.
- Reuse existing searchable autocomplete, table, form, and page patterns before creating new ones.

## Recommended Order

1. Migration, if needed
2. Model updates and scopes
3. Services
4. Policy
5. Serializers
6. Controller and routes
7. Frontend API types
8. Composables
9. Components
10. Pages and navigation
11. Focused tests and manual verification steps

## Backend Checklist

- Model fields, associations, validations, and scopes are in place.
- Policy methods default to restrictive behavior and explicitly allow only valid actions.
- Services use `ServiceName.perform(args)` and own multi-step mutations.
- Controller uses serializers and returns the correct HTTP status codes.
- Resource is exported from the relevant `index.ts` files.

## Frontend Checklist

- API client exposes the needed types and CRUD methods.
- Nested backend routes have matching nested frontend API folders and namespace exports.
- Composables provide list and record loading patterns.
- Forms handle validation and submit through the API client.
- List and detail/edit pages match existing admin page patterns.
- Routes and navigation links are wired in.

## Endpoint and API Client Shape

When adding model-specific behavior for an existing shared resource, prefer nested model routes over
expanding a top-level endpoint beyond its original domain.

Use this pattern:

```text
api/src/controllers/workflow-templates/share-point-folders-controller.ts
web/src/api/workflow-templates/share-point-folders-api.ts
web/src/api/workflow-templates/share-point-folders/files-api.ts
```

Avoid this pattern:

```text
web/src/api/workflow-template-share-point-folders-api.ts
```

For polymorphic backend models, keep the frontend type generic unless a separate model truly exists.
Backend controllers or services should set or constrain the concrete target type; callers should not
be trusted to choose a safe `targetType`.

## WRAP Admin Page Pattern

The dominant WRAP administration detail pattern is:

1. A route-level layout in `web/src/layouts/administration/...`
2. A summary card at the top of the layout
3. A `HeaderActionsCard` containing `v-tabs`, tab-aware CTA buttons, and `<router-view />`
4. Child pages in `web/src/pages/administration/...` for each tab

Use this pattern for resources like:

- `OrganizationLayout` + `OrganizationCategoriesPage`, `OrganizationTeamsPage`,
  `OrganizationPositionsPage`, `OrganizationUsersPage`
- `UserLayout` + `UserPositionsPage`, `UserTeamsPage`, `WorkflowActionsPage`,
  `UserAuthoritiesPage`
- `PositionLayout` + `PositionUsersPage`, `PositionTeamsPage`
- `TeamLayout` + `TeamPositionsPage`, `TeamUsersPage`
- `TemplateLayout` + `TemplateWorkflowDetailsPage`, `TemplateStepsPage`,
  `TemplateSharedWithPage`

For standalone detail records without related tabbed views, use a single detail page with
`HeaderActionsCard` instead.

## Templates

This workflow currently relies on these template files:

- Tab host layout:
  [`agents/templates/administration-tab-layout-template.md`](../templates/administration-tab-layout-template.md)
- Child tab page:
  [`agents/templates/administration-tab-page-template.md`](../templates/administration-tab-page-template.md)

## Common Pitfalls

- Forgetting to add or export scopes needed by search and uniqueness checks.
- Putting business logic in controllers or components instead of services.
- Forgetting route, controller, or policy index exports.
- Creating new UI patterns when a local administration pattern already exists.
- Adding model-specific methods to a top-level API client when the backend route is nested.

---

**Last Updated:** 2026-06-15

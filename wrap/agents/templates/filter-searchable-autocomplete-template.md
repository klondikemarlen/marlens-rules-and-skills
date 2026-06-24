# Filter Searchable Autocomplete Template

Route-query-synced wrapper for a searchable autocomplete. Syncs selected filter state to a URL query parameter so filter state survives page refreshes and dashboard reloads.

## File

`web/src/components/common/tables/Filter{Model}SearchableAutocomplete.vue`

## Template: Single ID Filter

```vue
<template><{Model}SearchableAutocomplete v-model="modelId" :filters="filters" /></template>

<script setup lang="ts">
import { watch } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { integerTransformer } from "@/utils/use-route-query-transformers"

import {Model}SearchableAutocomplete from "@/components/{model-plural}/{Model}SearchableAutocomplete.vue"

const loaded = defineModel<boolean>("loaded", {
  default: false,
})

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    filters?: Omit<{Model}FiltersOptions, "search">
    routeQueryPrefix?: string
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    routeQueryPrefix: "{defaultPrefix}",
    routeQuerySuffix: "",
  }
)

const emit = defineEmits<{
  "update:modelValue": [modelId: number | null]
}>()

const modelId = useRouteQuery<string | null, number | null>(
  `${props.routeQueryPrefix}Id${props.routeQuerySuffix}`,
  null,
  {
    transform: integerTransformer,
  }
)

watch(
  () => modelId.value,
  (newModelId, oldModelId) => {
    if (loaded.value === false && oldModelId === undefined) {
      loaded.value = true
    }

    emit("update:modelValue", newModelId)
  },
  {
    immediate: true,
  }
)

function clear() {
  modelId.value = null
}

defineExpose({
  clear,
})
</script>
```

## Template: Multi-Reference Filter

Use this pattern when the filter stores multiple structured references instead of a single numeric id. Current dashboard example: **Waiting On**.

```vue
<template>
  <PotentialPlayersSearchableAutocomplete
    v-model="selectedPotentialPlayers"
    :filters="filters"
  />
</template>

<script setup lang="ts">
import { computed, watch } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { pick } from "lodash"

import { jsonTransformer } from "@/utils/use-route-query-transformers"
import { type WorkflowPlayerReference } from "@/api/workflow-player-references-api"
import {
  type PotentialPlayer,
  type PotentialPlayerFiltersOptions,
} from "@/use/use-potential-players"

import PotentialPlayersSearchableAutocomplete from "@/components/workflow-players/PotentialPlayersSearchableAutocomplete.vue"

const loaded = defineModel<boolean>("loaded", {
  default: false,
})

const props = withDefaults(
  defineProps<{
    modelValue: WorkflowPlayerReference[] | null
    filters?: Omit<PotentialPlayerFiltersOptions, "search">
    routeQueryPrefix?: string
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    routeQueryPrefix: "{defaultPrefix}",
    routeQuerySuffix: "",
  }
)

const emit = defineEmits<{
  "update:modelValue": [workflowPlayerReferences: WorkflowPlayerReference[] | null]
}>()

const selectedWorkflowPlayerReferences = useRouteQuery<
  string | undefined,
  WorkflowPlayerReference[]
>(`${props.routeQueryPrefix}PlayerReferences${props.routeQuerySuffix}`, "[]", {
  transform: {
    get(value: string | undefined): WorkflowPlayerReference[] {
      return jsonTransformer.get<WorkflowPlayerReference[]>(value) ?? []
    },
    set(value: WorkflowPlayerReference[]): string | undefined {
      return jsonTransformer.set(
        value.map((workflowPlayerReference) =>
          pick(workflowPlayerReference, ["userId", "positionId", "teamId"])
        ) as PotentialPlayer[]
      )
    },
  },
})

const selectedPotentialPlayers = computed<PotentialPlayer[]>({
  get() {
    return selectedWorkflowPlayerReferences.value as PotentialPlayer[]
  },
  set(potentialPlayers) {
    selectedWorkflowPlayerReferences.value = potentialPlayers as WorkflowPlayerReference[]
  },
})

watch(
  () => selectedWorkflowPlayerReferences.value,
  (newSelectedWorkflowPlayerReferences, oldSelectedWorkflowPlayerReferences) => {
    if (loaded.value === false && oldSelectedWorkflowPlayerReferences === undefined) {
      loaded.value = true
    }

    emit("update:modelValue", newSelectedWorkflowPlayerReferences)
  },
  {
    immediate: true,
  }
)

function clear() {
  selectedWorkflowPlayerReferences.value = []
}

defineExpose({
  clear,
})
</script>
```

## Placeholders

| Placeholder       | Example                   | Notes                                                                  |
| ----------------- | ------------------------- | ---------------------------------------------------------------------- |
| `{Model}`         | `User`                    | PascalCase singular                                                    |
| `{model-plural}`  | `users`                   | kebab-case plural component directory                                  |
| `{defaultPrefix}` | `creator`, `waitingOnAny` | Route query prefix matching the filter key shape used by the wrapper   |
| `modelId`         | `userId`                  | camelCase variable matching the route query key for single-id wrappers |

## Current Dashboard Menu Patterns

### Created By

- File: `FilterUserSearchableAutocomplete.vue`
- Route query key: `creatorId`
- Wrapper model value: `number | null`
- Forwards `filters` to the underlying searchable autocomplete
- Used in `DashboardWorkflowFiltersMenu.vue` as the **Created By** filter

### Waiting On

- File: `FilterWorkflowPlayerReferenceSearchableAutocomplete.vue`
- Route query key: `waitingOnAnyPlayerReferences`
- Wrapper model value: `WorkflowPlayerReference[]`
- Uses `jsonTransformer` because the route query stores structured player references, not a single id
- Maps values through `PotentialPlayersSearchableAutocomplete`
- Used in `DashboardWorkflowFiltersMenu.vue` as the **Waiting On** filter

## Rules Pulled from Live Examples

- Default the `loaded` model to `false` and flip it to `true` on the first watcher run where the old route-query value is `undefined`
- Always expose a `clear()` method so parent filter menus can reset the wrapper imperatively
- Forward `filters` props to the underlying autocomplete when the candidate list needs scoping
- Use `integerTransformer` for single-id route-query wrappers
- Use `jsonTransformer` only when the route query needs to preserve structured reference arrays
- Choose a route query prefix that produces a stable, self-explanatory query key used by the live filter
- Keep the wrapper thin; business logic belongs in the underlying searchable autocomplete or API filter scopes

## Integration

After creating, wire into `DashboardWorkflowFiltersMenu.vue` and follow `agents/workflows/dashboard-filter-workflow.md` for the rest of the dashboard filter stack.

---

**Reference Implementations:** `FilterUserSearchableAutocomplete.vue`, `FilterWorkflowPlayerReferenceSearchableAutocomplete.vue`

**Last Updated:** 2026-03-18

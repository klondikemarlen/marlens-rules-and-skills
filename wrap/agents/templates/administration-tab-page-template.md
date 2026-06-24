# Administration Tab Page Template

Template for a child page rendered inside an administration detail layout tab.

## Use This When

- the parent administration layout already renders the main card and tab chrome
- the child page only needs to render one related list or one focused related view
- the page should keep its own route-query state separate from sibling tabs

## File

`web/src/pages/administration/{resource-names}/{ResourceName}{TabName}Page.vue`

## Template: Filtered Data Table Tab

```vue
<template>
  <{RelatedResourceNames}FilterableDataTableServer :where="where"
  route-query-suffix="{RouteQuerySuffix}" {optional-hide-parent-column} />
</template>

<script setup lang="ts">
import { computed } from "vue"

import {RelatedResourceNames}FilterableDataTableServer from "@/components/{related-resource-names}/{RelatedResourceNames}FilterableDataTableServer.vue"

const props = defineProps<{
  {resourceName}Id: string
}>()

const {resourceName}IdAsNumber = computed(() => parseInt(props.{resourceName}Id))

const where = computed(() => ({
  {parentForeignKey}: {resourceName}IdAsNumber.value,
}))
</script>
```

## Template: Filtered Data Table Tab With Delete Action

```vue
<template>
  <{RelatedResourceNames}FilterableDataTableServer
    ref="{relatedResourceNames}FilterableDataTableServer"
    :where="where"
    route-query-suffix="{RouteQuerySuffix}"
  >
    <template #item.actions="{ item }">
      <v-btn
        color="secondary"
        variant="outlined"
        :to="{
          name: 'administration/{view-resource-names}/{ViewResourceName}Page',
          params: {
            {viewResourceName}Id: item.{viewResourceName}Id,
          },
        }"
      >
        View
      </v-btn>
      <v-btn
        v-if="policy?.update"
        class="ml-2"
        color="error"
        variant="outlined"
        :loading="isDeleting"
        @click="deleteRelatedRecord(item.id)"
      >
        {Delete Label}
      </v-btn>
    </template>
  </{RelatedResourceNames}FilterableDataTableServer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import {relatedResourceNames}Api from "@/api/{related-resource-names}-api"
import use{ResourceName} from "@/use/use-{resource-name}"
import useSnack from "@/use/use-snack"

import {RelatedResourceNames}FilterableDataTableServer from "@/components/{related-resource-names}/{RelatedResourceNames}FilterableDataTableServer.vue"

const props = defineProps<{
  {resourceName}Id: string
}>()

const {resourceName}IdAsNumber = computed(() => parseInt(props.{resourceName}Id))
const { policy } = use{ResourceName}({resourceName}IdAsNumber)

const where = computed(() => ({
  {parentForeignKey}: {resourceName}IdAsNumber.value,
}))

const {relatedResourceNames}FilterableDataTableServer = ref<InstanceType<
  typeof {RelatedResourceNames}FilterableDataTableServer
> | null>(null)
const isDeleting = ref(false)
const snack = useSnack()

async function deleteRelatedRecord(relatedRecordId: number) {
  if (!blockedToTrueConfirm("{Delete Confirmation}")) return

  isDeleting.value = true
  try {
    await {relatedResourceNames}Api.delete(relatedRecordId)
    await {relatedResourceNames}FilterableDataTableServer.value?.refresh()
    snack.success("{Delete Success}")
  } catch (error) {
    console.error("Failed to delete related record:", error)
    snack.error(`{Delete Error Prefix}: ${error}`)
  } finally {
    isDeleting.value = false
  }
}
</script>
```

## Rules Pulled from Live Examples

- Child tab pages stay small; they usually only parse the parent id, build a `where` computed, and
  render one table or focused view.
- Always give each tab its own `route-query-suffix` so filters and pagination don’t collide across
  sibling tabs.
- When the table includes delete actions, refresh the table in place instead of routing away.
- Use the parent resource composable only for tab-local policy checks, not for rebuilding the full
  page shell.

## Reference Implementations

- `web/src/pages/administration/organizations/OrganizationCategoriesPage.vue`
- `web/src/pages/administration/organizations/OrganizationUsersPage.vue`
- `web/src/pages/administration/positions/PositionUsersPage.vue`
- `web/src/pages/administration/positions/PositionTeamsPage.vue`
- `web/src/pages/administration/users/UserTeamsPage.vue`
- `web/src/pages/administration/users/UserPositionsPage.vue`

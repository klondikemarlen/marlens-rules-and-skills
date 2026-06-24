# Administration Tab Layout Template

Template for an administration detail resource that uses a layout as the tab host and child pages
for each tab.

## Use This When

- the resource has a detail card plus 2+ related admin subpages
- each tab has its own route and breadcrumb entry
- header actions change based on the active tab

## File

`web/src/layouts/administration/{resource-names}/{ResourceName}Layout.vue`

## Template

```vue
<template>
  <v-row>
    <v-col> <{ResourceName}Card :{resource-name}-id="{resourceName}Id" /> </v-col>
  </v-row>

  <v-row>
    <v-col>
      <HeaderActionsCard>
        <template #header>
          <v-tabs>
            <v-tab
              text="{Tab 1}"
              :to="{
                name: 'administration/{resource-names}/{ResourceName}{TabOne}Page',
                params: {
                  {resourceName}Id,
                },
              }"
            />
            <v-tab
              text="{Tab 2}"
              :to="{
                name: 'administration/{resource-names}/{ResourceName}{TabTwo}Page',
                params: {
                  {resourceName}Id,
                },
              }"
            />
          </v-tabs>
        </template>

        <template
          v-if="policy?.update"
          #header-actions
        >
          <v-btn
            v-if="route.name === 'administration/{resource-names}/{ResourceName}{TabOne}Page'"
            color="secondary"
            :to="{
              name: 'administration/{resource-names}/{TabOneChildNewPage}',
              params: {
                {resourceName}Id,
              },
              query: {
                returnTo,
              },
            }"
          >
            <v-icon start>mdi-plus</v-icon>
            {Tab One CTA}
          </v-btn>
          <v-btn
            v-else-if="route.name === 'administration/{resource-names}/{ResourceName}{TabTwo}Page'"
            color="secondary"
            :to="{
              name: 'administration/{resource-names}/{TabTwoChildNewPage}',
              params: {
                {resourceName}Id,
              },
              query: {
                returnTo,
              },
            }"
          >
            <v-icon start>mdi-plus</v-icon>
            {Tab Two CTA}
          </v-btn>
        </template>

        <router-view />
      </HeaderActionsCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type RouteLocation, useRoute, useRouter } from "vue-router"

import useBreadcrumbs, { type Breadcrumb } from "@/use/use-breadcrumbs"
import use{ResourceName} from "@/use/use-{resource-name}"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import {ResourceName}Card from "@/components/{resource-names}/{ResourceName}Card.vue"

const props = defineProps<{
  {resourceName}Id: string
}>()

const {resourceName}Id = computed(() => parseInt(props.{resourceName}Id))
const { {resourceName}, policy } = use{ResourceName}({resourceName}Id)

const route = useRoute()
const router = useRouter()

const returnTo = computed(() => {
  let routeLocation: RouteLocation & {
    href: string
  }

  if (route.name === "administration/{resource-names}/{ResourceName}{TabOne}Page") {
    routeLocation = router.resolve({
      name: "administration/{resource-names}/{ResourceName}{TabOne}Page",
      params: {
        {resourceName}Id: props.{resourceName}Id,
      },
    })
  } else if (route.name === "administration/{resource-names}/{ResourceName}{TabTwo}Page") {
    routeLocation = router.resolve({
      name: "administration/{resource-names}/{ResourceName}{TabTwo}Page",
      params: {
        {resourceName}Id: props.{resourceName}Id,
      },
    })
  } else {
    routeLocation = router.resolve({
      name: "administration/{resource-names}/{ResourceName}Page",
      params: {
        {resourceName}Id: props.{resourceName}Id,
      },
    })
  }

  return routeLocation.href
})

const breadcrumbs = computed(() => {
  const tabCrumbs: Breadcrumb[] = []

  if (route.name === "administration/{resource-names}/{ResourceName}{TabOne}Page") {
    tabCrumbs.push({
      title: "{Tab 1}",
      to: {
        name: "administration/{resource-names}/{ResourceName}{TabOne}Page",
        params: {
          {resourceName}Id: props.{resourceName}Id,
        },
      },
    })
  } else if (route.name === "administration/{resource-names}/{ResourceName}{TabTwo}Page") {
    tabCrumbs.push({
      title: "{Tab 2}",
      to: {
        name: "administration/{resource-names}/{ResourceName}{TabTwo}Page",
        params: {
          {resourceName}Id: props.{resourceName}Id,
        },
      },
    })
  }

  return [
    {
      title: "{Resource Names}",
      to: {
        name: "administration/{ResourceNames}Page",
      },
    },
    {
      title: {resourceName}.value?.{primaryLabelField},
      to: {
        name: "administration/{resource-names}/{ResourceName}Page",
        params: {
          {resourceName}Id: props.{resourceName}Id,
        },
      },
      disabled: route.name === "administration/{resource-names}/{ResourceName}{TabOne}Page",
    },
    ...tabCrumbs,
  ]
})

useBreadcrumbs("{Resource Name} Details", breadcrumbs)
</script>
```

## Rules Pulled from Live Examples

- The layout, not the child page, owns the card, tabs, tab-aware header actions, and breadcrumb
  branching.
- The base detail route redirects to a default tab child route.
- New child-record pages usually accept a `returnTo` query value so cancel/save can go back to the
  active tab.
- Use `<router-view />` inside the shared `HeaderActionsCard`.

## Reference Implementations

- `web/src/layouts/administration/organizations/OrganizationLayout.vue`
- `web/src/layouts/administration/users/UserLayout.vue`
- `web/src/layouts/administration/positions/PositionLayout.vue`
- `web/src/layouts/administration/teams/TeamLayout.vue`
- `web/src/layouts/administration/templates/TemplateLayout.vue`

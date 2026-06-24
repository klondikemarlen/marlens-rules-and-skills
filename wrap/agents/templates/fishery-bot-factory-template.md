# FisheryBot Factory Template

Template for creating FisheryBotFactory instances.

## Simple Factory (No Associations)

**File:** `tests/factories/resource-name-factory.ts`

```typescript
import { faker } from "@faker-js/faker"

import FisheryBotFactory from "@/lib/fishery-bot"

import { ResourceName } from "@/models"

export const resourceNameFactory = FisheryBotFactory.define(ResourceName, ({ sequence }) => {
  return {
    field1: faker.datatype.string(),
    field2: faker.helpers.enumValue(ResourceName.Enum),
    uniqueField: `value-${sequence}`,
  }
})

export default resourceNameFactory
```

## Factory with Associations

**File:** `tests/factories/resource-name-factory.ts`

```typescript
import { faker } from "@faker-js/faker"

import FisheryBotFactory from "@/lib/fishery-bot"

import { ResourceName } from "@/models"

import associatedFactory from "@/factories/associated-factory"

export const resourceNameFactory = FisheryBotFactory.define(ResourceName, ({ associate }) => {
  associate("associationName", associatedFactory)

  return {
    field1: faker.datatype.string(),
    field2: faker.helpers.enumValue(ResourceName.Enum),
  }
})

export default resourceNameFactory
```

## Factory with Both Sequence and Associations

**File:** `tests/factories/resource-name-factory.ts`

```typescript
import { faker } from "@faker-js/faker"

import FisheryBotFactory from "@/lib/fishery-bot"

import { ResourceName } from "@/models"

import associatedFactory from "@/factories/associated-factory"

export const resourceNameFactory = FisheryBotFactory.define(ResourceName, ({ sequence, associate }) => {
  associate("associationName", associatedFactory)

  return {
    uniqueField: `value-${sequence}`,
    field2: faker.helpers.enumValue(ResourceName.Enum),
  }
})

export default resourceNameFactory
```

---

**Reference Implementation:** Dashboard Factory, Delegation Factory

**Last Updated:** 2026-02-17

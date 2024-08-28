#### Tailwind CSS z-index Values

| Component                        | z-index |
| -------------------------------- | ------- |
| Popover/Tooltip/ActionsDropdown  | z-[5]   |
| App Sidebar Mobile Nav           | z-10    |
| Slideover                        | z-20    |
| Modal                            | z-30    |
| Flash                            | z-45    |
| Unused (preserved for consumers) | z-50    |

#### Climbing Above The Rest

In the event that you need to establish a z-index level above any of
the overlay components, you'll need to wrap your component in the
HeadlessUI/Vue `<Portal />` component. This
convenience component is not documented by HeadlessUI, but is
effectively a wrapper around the Vue Teleport component. It
maintains a single container before the closing body tag and
teleports all Portal markup to that location ensuring the same
stacking context between those DOM elements.

```html
<script lang="ts" setup>
  import { Portal } from "@headlessui/vue"
</script>

<template>
  <Portal>
    <div class="fixed top-0 left-0 right-0 bottom-0 z-50">
      <h1>Head and shoulders above the rest!</h1>
    </div>
  </Portal>
</template>
```

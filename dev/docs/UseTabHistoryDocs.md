#### Example Usage with useTabHistory

Note: if you don't wish to track the tab state on the url, just pass your ref and tabs directly to the component.

```html
<script setup lang="ts">
  const { activeTab, isActiveTab, tabs } = useTabHistory([
    { label: "Tab One", value: "tab-1" },
    { label: "Tab Two", value: "tab-2" },
  ])
</script>

<template>
  <Tabs v-model="activeTab" :tabs="tabs" />
  <div v-if="isActiveTab('tab-1')">Tab 1 Content</div>
  <div v-if="isActiveTab('tab-2')">Tab 2 Content</div>
</template>
```

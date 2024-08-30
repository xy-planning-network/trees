<style>
    .test-card-compact {
        @apply bg-white shadow-md p-4 min-h-[5rem] w-full;
    }

    .test-card {
        @apply bg-white shadow-md p-8 min-h-[5rem] w-full;
    }
</style>

<DocsDemo>
    <div class="test-card prose rounded-xy-lg">
        <h3>Card</h3>
        <p>The content of this larger card.</p>
    </div>
</DocsDemo>

```html
// rounded-xy 18px - use when the containers internal padding < 1.5rem (24px)
.rounded-xy
```

<DocsDemo>
    <div class="test-card-compact prose rounded-xy">
        <h4>Compact Card</h4>
        <p>The content of this compact card.</p>
    </div>
</DocsDemo>

```html
// rounded-xy 32px - use when the containers internal padding > 1.5rem (24px)
.rounded-xy-lg
```

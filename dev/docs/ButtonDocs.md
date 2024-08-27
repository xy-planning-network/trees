<style>
    .btn-layout {
        @apply my-2 flex flex-col items-center justify-start space-y-4 sm:flex-row sm:items-end sm:space-y-0 sm:space-x-3;
    }
</style>

## Button Sizing

Buttons are available in three size. In most use cases you should reach for the base size. Leverage the small size when you're working in a compact space like a tight list or compact card. The large size should see minimal usage and is generally reserved for marketing like situations.

## Common Buttons

For the majority of your application interface you'll reach for buttons `xy-btn` and `xy-btn-secondary`. They're the bread and butter of buttons and it's best not to over think them. Think of the `xy-btn` as the primary call to action on any given page or interface - its the UI happy path you'd hope the user will take. Use `xy-btn-secondary` as the alterntive UI path and keep in mind that sometimes the happy path in a UI is for the user to do nothing but read the copy you've provided.

### Primary

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-sm">Button Text</button>
        <button class="xy-btn">Button Text</button>
        <button class="xy-btn-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-sm" disabled>Button Text</button>
        <button class="xy-btn" disabled>Button Text</button>
        <button class="xy-btn-lg" disabled>Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-sm">Button Text</button>
<button class="xy-btn">Button Text</button>
<button class="xy-btn-lg">Button Text</button>

<!-- disabled -->
<button class="xy-btn-sm" disabled>Button Text</button>
<button class="xy-btn" disabled>Button Text</button>
<button class="xy-btn-lg" disabled>Button Text</button>
```

### Secondary

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-secondary-sm">Button Text</button>
        <button class="xy-btn-secondary">Button Text</button>
        <button class="xy-btn-secondary-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-secondary-sm" disabled>Button Text</button>
        <button class="xy-btn-secondary" disabled>Button Text</button>
        <button class="xy-btn-secondary-lg" disabled>Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-secondary-sm">Button Text</button>
<button class="xy-btn-secondary">Button Text</button>
<button class="xy-btn-secondary-lg">Button Text</button>

<!-- disabled -->
<button class="xy-btn-secondary-sm" disabled>Button Text</button>
<button class="xy-btn-secondary" disabled>Button Text</button>
<button class="xy-btn-secondary-lg" disabled>Button Text</button>
```

## Utility Buttons

Utility buttons are useful for indicating purpose. `danger` for situations when a destructive action is taking place and `neutral` for when situations like canceling an action.

### Danger

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-danger-sm">Button Text</button>
        <button class="xy-btn-danger">Button Text</button>
        <button class="xy-btn-danger-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-danger-sm" disabled>Button Text</button>
        <button class="xy-btn-danger" disabled>Button Text</button>
        <button class="xy-btn-danger-lg" disabled>Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-secondary-danger-sm">Button Text</button>
        <button class="xy-btn-secondary-danger">Button Text</button>
        <button class="xy-btn-secondary-danger-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-secondary-danger-sm" disabled>Button Text</button>
        <button class="xy-btn-secondary-danger" disabled>Button Text</button>
        <button class="xy-btn-secondary-danger-lg" disabled>Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-danger-sm">Button Text</button>
<button class="xy-btn-danger">Button Text</button>
<button class="xy-btn-danger-lg">Button Text</button>

<!-- disabled -->
<button class="xy-btn-danger-sm" disabled>Button Text</button>
<button class="xy-btn-danger" disabled>Button Text</button>
<button class="xy-btn-danger-lg" disabled>Button Text</button>

<!-- secondary -->
<button class="xy-btn-secondary-danger-sm">Button Text</button>
<button class="xy-btn-secondary-danger">Button Text</button>
<button class="xy-btn-secondary-danger-lg">Button Text</button>

<!-- secondary disabled-->
<button class="xy-btn-secondary-danger-sm" disabled>Button Text</button>
<button class="xy-btn-secondary-danger" disabled>Button Text</button>
<button class="xy-btn-secondary-danger-lg" disabled>
  Button disabled Text
</button>
```

### Neutral

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-neutral-sm">Button Text</button>
        <button class="xy-btn-neutral">Button Text</button>
        <button class="xy-btn-neutral-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-neutral-sm" disabled>Button Text</button>
        <button class="xy-btn-neutral" disabled>Button Text</button>
        <button class="xy-btn-neutral-lg" disabled>Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-neutral-sm">Button Text</button>
<button class="xy-btn-neutral">Button Text</button>
<button class="xy-btn-neutral-lg">Button Text</button>

<!-- disabled -->
<button class="xy-btn-neutral-sm" disabled>Button Text</button>
<button class="xy-btn-neutral" disabled>Button Text</button>
<button class="xy-btn-neutral-lg" disabled>Button Text</button>
```

## Specialty Buttons

These specialty buttons should be used sparingly and are generally reserved for marketing situations.

### Accent

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-accent-sm">Button Text</button>
        <button class="xy-btn-accent">Button Text</button>
        <button class="xy-btn-accent-lg">Button Text</button>
    </div>
    <div class="btn-layout">
        <button class="xy-btn-accent-sm" disabled>Button Text</button>
        <button class="xy-btn-accent" disabled>Button Text</button>
        <button class="xy-btn-accent-lg" disabled>Button Text</button>
    </div>
    <div class="btn-layout bg-neutral-700 rounded-xl p-4 mt-8">
        <button class="xy-btn-accent-inverse-sm">Button Text</button>
        <button class="xy-btn-accent-inverse">Button Text</button>
        <button class="xy-btn-accent-inverse-lg">Button Text</button>
    </div>
    <div class="btn-layout bg-neutral-700 rounded-xl p-4 mt-8">
        <button class="xy-btn-accent-inverse-sm" disabled>Button Text</button>
        <button class="xy-btn-accent-inverse" disabled>Button Text</button>
        <button class="xy-btn-accent-inverse-lg" disabled>Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-accent-sm">Button Text</button>
<button class="xy-btn-accent">Button Text</button>
<button class="xy-btn-accent-lg">Button Text</button>

<!-- disabled -->
<button class="xy-btn-accent-sm" disabled>Button Text</button>
<button class="xy-btn-accent" disabled>Button Text</button>
<button class="xy-btn-accent-lg" disabled>Button Text</button>

<!-- inverse -->
<button class="xy-btn-accent-inverse-sm">Button Text</button>
<button class="xy-btn-accent-inverse">Button Text</button>
<button class="xy-btn-accent-inverse-lg">Button Text</button>

<!--inverse disabled-->
<button class="xy-btn-accent-inverse-sm" disabled>Button Text</button>
<button class="xy-btn-accent-inverse" disabled>Button Text</button>
<button class="xy-btn-accent-inverse-lg" disabled>Button Text</button>
```

## Deprecated

The following buttons are deprecated and their usage should be replaced.

### White

Most of the existing use cases can be replaced with either `xy-btn-secondary` or `xy-btn-neutral`.

<DocsDemo>
    <div class="btn-layout">
        <button class="xy-btn-white">Button Text</button>
    </div>
</DocsDemo>

```html
<button class="xy-btn-white">Button Text</button>
```

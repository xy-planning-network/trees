# Vue the Trees

## What's Trees

Trees is our attempt at unifying the frontend code we've written to power a small handful of web applications. We prefer the slower method of walking the [trails](https://github.com/xy-planning-network/trails), smelling the trees, and staying closer to the dirt than something speedier on the road. This bad boy is just getting of the ground and will be in v0 for the foreseeable future.

## What needs to be done?

- [x] Skeleton for NPM Component Library
- [x] Button component
- [x] Form input (checkbox, input, select, textarea) components
- [x] Nav component
- [x] DateRangePicker component
- [x] Paginator component
- [x] Table component
- [x] Layout component
- [x] Spinner component
- [x] Flash component
- [x] DetailList component
- [x] Components for basic text + layout (paragraphs, headers, subcontent, etc...)
- [x] Actions container component
- [ ] Initial UI kit website with deploy pipeline
- [ ] Table component scaffolded from trails defined struct
- [ ] Modal forms + regular defined on server component
- [ ] Get icon for project and make it home link
- [ ] Add emitted events to component detail view
- [ ] Make library types links in component detail view
- [ ] Add table component example that uses ActionsDropdown and handles emitted event
- [ ] Bump to new version of vue-cli and bump postcss -> 8
- [ ] Improve form element disabled and error states
- [ ] Line up buttons and badges with design system

## What needs to be fixed?

- [x] Ensure flatpickr is picked up on build
- [ ] Select install for globally available components
- [ ] Make sure components have names in devtools
- [ ] Look into forcing tables to dropdown when actions open up in hidden area
- [ ] Fix select placeholder only showing up in dropdown
- [x] DateFilter input heights is not consistent. Make select match datepicker.

## Roadmap

- [x] move to vite for building the dev site, library, and possible storybook
- [x] refactor componentes away from class decorators to setup sugar
- [ ] consider implementing storybook using vite as the bundler

## Install

Install trees and mitt into an existing Vue project - assumes npm version >= 7

```sh
npm i @xy-planning-network/trees mitt
```

Additional peer dependecies will be installed by NPM. If you are using NPM < 7 you may need to explicitly install peer dependencies.

## Setup

### ESLint

**Initialize ESLint rules in .eslintrc.js**

```js
/* eslint-env node */
export default = {
  extends: "./node_modules/@xy-planning-network/trees/config/eslint.ts",
}
```

### Prettier

**Initialize Prettier rules in .prettierrc.json**

```json
"@xy-planning-network/trees/config/prettier.js"
```

### Fonts

**Include Inter Var in html template**

```html
<head>
  <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
</head>
```

**Optionally include Work Sans in html template**

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
    rel="stylesheet"
  />
</head>
```

### Styles

**Initialize styles in main.css**

```css
/* main.css */

/* import trees base styles */
@import "@xy-planning-network/trees/src/index.css";

/* additional tailwind styles */
@layer components {
  .xy-example {
    @apply inline-flex justify-center items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800;
  }
}
```

**Merge with the trees tailwind.cofig.js**

Note you may need a deep merge utility depending on the depth of properties you plan to override.

```js
/* eslint-disable */
const treesConfig = require("@xy-planning-network/trees/config/tailwind.config")
module.exports = {
  ...treesConfig,
  content: [...treesConfig.content, ...["./src/**/*.vue"]],
}
```

### JavaScript - Only What You Need

This is the best option when tree shaking and final bundle size is important to you.

**Initialize trees dependencies in your application root**

```ts
// main.ts
import Vue, { createApp } from "vue"
import App from "./App.vue"

// import your project's main stylesheet
import "@/main.css"

// initialize the app
const app = createApp(App)
app.mount("#vue-app")
```

**Use Trees components as needed in your components**

```ts
<script setup lang="ts">
  import { ref } from "vue"
  import { BaseInput} from "@xy-planning-network/trees"

  const myInputVal = ref("")
</script>
<template>
  <form>
    <BaseInput
      v-model="myInputVal"
      type="text"
      label="What's on your mind"
      help="Don't over think it!"
    />
  </form>
</template>
```

### JavaScript - Give Me The Kitchen Sink

This example installs all components of Trees globally so you don't need to import them in your components. Useful for hitting the ground running with as little friction as possible. Bundles size will suffer as tree shaking optimizations will be limited.

**Install all Trees components as a Vue plugin in your project root**

```ts
// main.ts
// include the type interfaces for Trees components installed globally on the Vue instance
/// <reference types="@xy-planning-network/trees/types/components" />

import Vue, { createApp } from "vue"
import Trees from "@xy-planning-network/trees"
import App from "./App.vue"

// import your project's main stylesheet
import "@/main.css"

// initialize the app
const app = createApp(App)

// use all of Trees as a vue plugin
app.use(Trees)

// mount the application
app.mount("#vue-app")
```

**Use Trees components as globally in your components**

```ts
<script setup lang="ts">
  import { ref } from "vue"
  const myInputVal = ref("")
</script>
<template>
  <form>
    <!-- BaseInput is globally available -->
    <BaseInput
      v-model="myInputVal"
      type="text"
      label="What's on your mind"
      help="Don't over think it!"
    />
  </form>
</template>
```

### JavaScript - Cherry Pick Components As A Plugin

This example selectively installs the Form components of Trees globally so you don't need to import them in your components. All other Trees components need to be explicitly imported.

**Create a project based plugin for just the Trees form components**

```ts
// plugins/trees.ts
// plugins/trees.ts
import { App } from "vue"
import {
  BaseInput,
  Checkbox,
  DateRangePicker,
  InputHelp,
  InputLabel,
  MultiCheckboxes,
  Radio,
  Select,
  TextArea,
  YesOrNoRadio,
} from "@xy-planning-network/trees"

/**
 * declare the global component types
 * should provide code completiong support in your editor - milage may vary
 * provides proper type checking on the components declared props
 */
declare module "@vue/runtime-core" {
  interface GlobalComponents {
    BaseInput: typeof BaseInput
    Checkbox: typeof Checkbox
    DateRangePicker: typeof DateRangePicker
    InputHelp: typeof InputHelp
    InputLabel: typeof InputLabel
    MultiCheckboxes: typeof MultiCheckboxes
    Radio: typeof Radio
    Select: typeof Select
    TextArea: typeof TextArea
    YesOrNoRadio: typeof YesOrNoRadio
  }
}

/**
 * export a plugin object with an install method
 */
export default {
  install(app: App) {
    app.component("BaseInput", BaseInput)
    app.component("Checkbox", Checkbox)
    app.component("DateRangePicker", DateRangePicker)
    app.component("InputHelp", InputHelp)
    app.component("InputLabel", InputLabel)
    app.component("MultiCheckboxes", MultiCheckboxes)
    app.component("Radio", Radio)
    app.component("Select", Select)
    app.component("TextArea", TextArea)
    app.component("YesOrNoRadio", YesOrNoRadio)
  },
}
```

```ts
// main.ts

import Vue, { createApp } from "vue"
import App from "./App.vue"
import TreesFormComponents from "./plugins/trees"

// import your project's main stylesheet
import "@/main.css"

// initialize the app
const app = createApp(App)

// use cherry picked Form components of Trees globally
app.use(TreesFormComponents)

// mount the application
app.mount("#vue-app")
```

**Use Trees components as globally in your components**

```ts
<script setup lang="ts">
  import { ref } from "vue"
  import { Cards } from "@xy-planning-network/trees"
  const myInputVal = ref("")
  const cardsList = [
    { primary: "Get Some", secondary: "You are gonna do well." },
    { primary: "Try It", secondary: "I'm proud of how far you've come." },
    { primary: "Nice Info", secondary: "Never stop trying." },
  ]

</script>
<template>
  <!--Cards needed to be imported -->
  <Cards :cards="cardsList" />
  <form>
    <!-- BaseInput is globally available -->
    <BaseInput
      v-model="myInputVal"
      type="text"
      label="What's on your mind"
      help="Don't over think it!"
    />
  </form>
</template>
```

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
- [ ] DateFilter input heights is not consistent. Make select match datepicker.

## Roadmap

- [ ] move to vite for building the dev site, library, and possible storybook
- [ ] consider implementing storybook using vite as the bundler
- [ ] refactor componentes away from class decorators to setup sugar

## Usage

### Installation

Install trees and mitt

```sh
npm i @xy-planning-network/trees mitt
```

### Enable as a Vue plugin

This example installs all components of Trees, which may not be necessary for all projects. Assumes you have a vue 3 project with tailwind created.

**Establish global types for VueBus and Flashes in global.d.ts**

```ts
// global.d.ts

import { Emitter } from "mitt";

declare global {
  interface Window {
    Flashes: Array<{ message: string }>;
    VueBus: Emitter;
  }
}
```

**Initialize trees components in main.ts**

```ts
// main.ts
import Vue, { createApp } from "vue";
import Mitt from "mitt";
import Trees from "@xy-planning-network/trees";
import HelloWorld from "@/components/HelloWorld.vue";

// import your project's main stylesheet
import "@/main.css";

// initialize the app
const app = createApp(HelloWorld);

// initialize mitt on VueBus
window.VueBus = mitt();

// use all of Trees as a vue plugin
app.use(Trees);

// mount the application
app.mount("#vue-app");
```

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

**Include Inter Var in html template**

```html
<head>
  <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
</head>
```

**Merge with the trees tailwind.cofig.js**

Note you may need a deep merge utility depending on the depth of properties you plan to override.

```js
/* eslint-disable */
const treesConfig = require("@xy-planning-network/trees/config/tailwind.config");
module.exports = {
  ...treesConfig,
  mode: "jit", // Optional
  purge: [...treesConfig.purge, ...["./src/**/*.vue"]],
};
```

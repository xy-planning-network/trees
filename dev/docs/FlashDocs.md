#### Flash generic error using configured email address

```ts
/* Import and do this anytime, best before createApp() or inside a root app level component */
import { useAppFlashes } from "@xy-planning-network/trees"
useAppFlashes().configure({ email: "support@trees.com" })

/* use as needed.  imports of useAppFlasher throughout the app will produce the same result */
useAppFlashes().flasher.genericError()
```

#### useAppFlasher is the default export as is what you need most of the time.

```ts
import useAppFlasher from "@xy-planning-network/trees"
```

#### Flash generic error with custom email address

```ts
useAppFlasher.genericError("help@trees.com")
```

#### Flash (error, info, success, warning)

```ts
useAppFlasher.error("Hooray!")
useAppFlasher.info("Hooray!")
useAppFlasher.success("Hooray!")
useAppFlasher.warning("Hooray!")
```

#### Flash persistent info

```ts
useAppFlasher.info("Sticky!", true)
```

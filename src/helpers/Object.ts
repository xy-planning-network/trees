/**
 * Safely gets a deeply nested value using dot notation
 */
export const get = <TDefault = unknown, TReturn = any>(
  obj: any,
  path: string,
  defaultValue?: TDefault
): TReturn | TDefault => {
  if (obj === null || obj === undefined) {
    return defaultValue as TDefault
  }

  const keys = path.split(".")

  const result = keys.reduce((acc: any, key: string) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined
  }, obj)

  return result === undefined ? (defaultValue as TDefault) : (result as TReturn)
}

/**
 * Safely sets a deeply nested value using dot notation (blocks Prototype Pollution)
 */
export const set = <T>(obj: T, path: string, value: any): T => {
  // If the target is not an object, return it as-is
  if (Object(obj) !== obj || obj === null) {
    return obj
  }

  const keys = path.split(".")
  let current: any = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]

    // Prevent Prototype Pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return obj
    }

    // If the next level doesn't exist or isn't an object, create it
    if (!current[key] || typeof current[key] !== "object") {
      // Look ahead to see if the next key is a number (e.g., 'items.0.name')
      const nextKey = keys[i + 1]
      current[key] = String(Math.abs(Number(nextKey))) === nextKey ? [] : {}
    }

    current = current[key]
  }

  const lastKey = keys[keys.length - 1]

  // Final prototype pollution check for the target assignment
  if (
    lastKey !== "__proto__" &&
    lastKey !== "constructor" &&
    lastKey !== "prototype"
  ) {
    current[lastKey] = value
  }

  return obj
}

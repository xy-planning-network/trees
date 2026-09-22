const unsafePaths = new Set(["__proto__", "constructor", "prototype"])
const arrayIndexPattern = /^(?:0|[1-9]\d*)$/

/**
 * setProperty assigns a value on an object using a dot-separated path. It
 * mutates `obj` and returns the same object reference.
 *
 * Numeric path segments create arrays when a container is missing, so
 * `items.0.name` creates an object within an `items` array. Other missing
 * containers are created as objects.
 *
 * Paths containing `__proto__`, `constructor`, or `prototype` are ignored to
 * avoid modifying object prototypes.
 *
 * Type safety is intentionally limited because `path` is a dynamic string.
 * TypeScript does not verify that the path exists on `O` or that the property
 * accepts `T`; supplying `T` does not perform runtime validation.
 *
 * @example
 * setProperty<User, string>(user, "profile.name", "Ada") // User
 * setProperty<Form, string>(form, "items.0.name", "First item") // Form
 */
function setProperty<
  O extends Record<string, any> = Record<string, any>,
  T = any,
>(obj: O, path: string, value: T): O {
  const keys = path.split(".")

  if (keys.some((key) => unsafePaths.has(key))) {
    return obj
  }

  let target: Record<string, any> = obj

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]
    const nextKey = keys[index + 1]
    const nextValue = target[key]

    if (nextValue === null || typeof nextValue !== "object") {
      target[key] = arrayIndexPattern.test(nextKey) ? [] : {}
    }

    target = target[key]
  }

  target[keys[keys.length - 1]] = value

  return obj
}

export default setProperty

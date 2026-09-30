const unsafePaths = new Set(["__proto__", "constructor", "prototype"])
const arrayIndexPattern = /^(?:0|[1-9]\d*)$/

const cloneContainer = (value: Record<string, any>) => {
  return Array.isArray(value) ? [...value] : { ...value }
}

/**
 * setProperty assigns a value on an object using a dot-separated path. It
 * returns a new object without mutating `obj`. Each container along the path
 * is cloned, while containers outside the path retain their references.
 *
 * Numeric path segments create arrays when a container is missing, so
 * `items.0.name` creates an object within an `items` array. Other missing
 * containers are created as objects.
 *
 * Paths containing `__proto__`, `constructor`, or `prototype` are ignored to
 * avoid modifying object prototypes.
 *
 * @example
 * setProperty(user, "profile.name", "Ada")
 * setProperty(form, "items.0.name", "First item")
 */
function setProperty<O extends Record<string, any>>(
  obj: O,
  path: string,
  value: unknown
): O {
  const keys = path.split(".")

  if (keys.some((key) => unsafePaths.has(key))) {
    return obj
  }

  const result = cloneContainer(obj) as O
  let target: Record<string, any> = result

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]
    const nextKey = keys[index + 1]
    const nextValue = target[key]

    if (nextValue !== null && typeof nextValue === "object") {
      target[key] = cloneContainer(nextValue)
    } else {
      target[key] = arrayIndexPattern.test(nextKey) ? [] : {}
    }

    target = target[key]
  }

  target[keys[keys.length - 1]] = value

  return result
}

export default setProperty

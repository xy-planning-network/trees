const unsafePaths = new Set(["__proto__", "constructor", "prototype"])
const arrayIndexPattern = /^(?:0|[1-9]\d*)$/

const cloneContainer = (value: Record<string, any>) => {
  return Array.isArray(value) ? [...value] : { ...value }
}

/**
 * deleteProperty removes a value at a dot-separated path without mutating
 * `obj`. Each container along the path is cloned, while containers outside
 * the path retain their references.
 *
 * Empty parent containers are retained.
 *
 * NOTE(spk): deleting an array index is experimental because schema fields do not
 * currently support applying `show` to an array item (but might with repeater fields).
 * Array indexes are removed with `splice` so payloads contain compact arrays instead
 * of entries that JSON would serialize as `null`.
 *
 * Missing and unsafe paths return the original object unchanged.
 */
function deleteProperty<O extends Record<string, any>>(
  obj: O,
  path: string
): O {
  const keys = path.split(".")

  if (keys.some((key) => unsafePaths.has(key))) {
    return obj
  }

  let source: Record<string, any> = obj
  const result = cloneContainer(obj) as O
  let target: Record<string, any> = result

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]

    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      return obj
    }

    const nextValue = source[key]
    if (nextValue === null || typeof nextValue !== "object") {
      return obj
    }

    const nextTarget = cloneContainer(nextValue)

    target[key] = nextTarget
    target = nextTarget
    source = nextValue
  }

  const property = keys[keys.length - 1]
  if (!Object.prototype.hasOwnProperty.call(source, property)) {
    return obj
  }

  if (Array.isArray(target) && arrayIndexPattern.test(property)) {
    target.splice(Number(property), 1)
  } else {
    Reflect.deleteProperty(target, property)
  }

  return result
}

export default deleteProperty

/**
 * getProperty reads a nested property from an object using a dot-separated path.
 * Numeric path segments can be used to access array elements, such as
 * `items.0.name`.
 *
 * `defaultValue` is returned when the path cannot be fully traversed or when the
 * resolved value is `undefined`.
 *
 * Type safety is intentionally limited because `path` is a dynamic string.
 * TypeScript does not verify that the path exists on `O` or that its value is
 * `T`; supplying `T` is a caller assertion and does not perform runtime
 * validation. Omit `T` to receive `any | undefined` when no default is
 * provided.
 *
 * @example
 * getProperty<User, string>(user, "profile.name") // string | undefined
 * getProperty<User, string>(user, "profile.name", "Unknown") // string
 */
function getProperty<
  O extends Record<string, any> = Record<string, any>,
  T = any,
>(obj: O, path: string): T | undefined

function getProperty<
  O extends Record<string, any> = Record<string, any>,
  T = any,
>(obj: O, path: string, defaultValue: T): T

function getProperty<
  O extends Record<string, any> = Record<string, any>,
  T = any,
>(obj: O, path: string, defaultValue?: T): T | undefined {
  let value: unknown = obj

  for (const key of path.split(".")) {
    if (value === null || typeof value !== "object") {
      return defaultValue
    }

    value = (value as O)[key]
  }

  return value === undefined ? defaultValue : (value as T)
}

export default getProperty

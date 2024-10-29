const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// NOTE(spk): Vue.js useId expects a currentInstance.  We'll hold on to this
// for now so we can continue to use it in non instance situations like useFlashes.
const CreateIdAttribute = (length = 8): string => {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export default {
  CreateIdAttribute,
}

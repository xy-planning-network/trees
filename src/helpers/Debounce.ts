export function debounce(func: () => void, timeout = 500): () => void {
  let timer: NodeJS.Timer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(args)
    }, timeout)
  }
}

export function debounceLeading(func: () => void, timeout = 500) {
  let timer: NodeJS.Timer | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (!timer) {
      func.apply(args)
    } else {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null
    }, timeout)
  }
}

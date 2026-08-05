export function debounce(fn: (...args: any[]) => void, wait = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

export function debounceLeading(func: () => void, timeout = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
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

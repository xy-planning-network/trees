export function throttle(func: () => void, timeout = 100) {
  let inThrottle: boolean

  return (...args: any[]) => {
    if (!inThrottle) {
      func.apply(args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), timeout)
    }
  }
}

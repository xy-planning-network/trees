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

export function delay(t: number, callback: () => void): () => void {
  const to = setTimeout(callback, t)
  return () => {
    clearTimeout(to)
  }
}

export function defer(callback: () => void): () => void {
  return delay(0, callback)
}

export function random(n: number): number {
  return (Math.random() - 0.5) * n
}

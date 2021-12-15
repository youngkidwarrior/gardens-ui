import { useEffect, useState } from 'react'

export default function usePromise(fn, memoParams, defaultValue) {
  const [result, setResult] = useState(defaultValue)
  useEffect(() => {
    let cancelled = false
    const promise = typeof fn === 'function' ? fn() : fn
    promise.then(value => {
      if (!cancelled) {
        setResult(value)
      }
    })
    return () => {
      cancelled = true
    }
  }, [...memoParams, fn])
  return result
}

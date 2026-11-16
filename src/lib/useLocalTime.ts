import { useEffect, useState } from 'react'

export function useLocalTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date())

    setTime(format())
    const timer = window.setInterval(() => setTime(format()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return time
}

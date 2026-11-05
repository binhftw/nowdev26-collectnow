import { useEffect, useState } from 'react'

/** Current time in ms, refreshed at the start of every minute. */
export function useMinuteNow(): number {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        let timer: number | undefined
        const schedule = () => {
            const delay = 60000 - (Date.now() % 60000) + 50
            timer = window.setTimeout(() => {
                setNow(Date.now())
                schedule()
            }, delay)
        }
        schedule()
        return () => window.clearTimeout(timer)
    }, [])

    return now
}

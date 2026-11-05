import { useCallback, useEffect, useRef, useState } from 'react'
import { Drop, fetchDrops } from '../services/drops'

export type LoadStatus = 'loading' | 'error' | 'ready'

export function useDrops() {
    const [status, setStatus] = useState<LoadStatus>('loading')
    const [drops, setDrops] = useState<Drop[]>([])
    const [error, setError] = useState('')
    const controllerRef = useRef<AbortController | null>(null)

    const load = useCallback(() => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller
        setStatus('loading')
        setError('')
        fetchDrops(controller.signal)
            .then((result) => {
                if (controller.signal.aborted) return
                setDrops(result)
                setStatus('ready')
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return
                setError(err instanceof Error ? err.message : 'Something went wrong.')
                setStatus('error')
            })
    }, [])

    useEffect(() => {
        load()
        return () => controllerRef.current?.abort()
    }, [load])

    return { status, drops, error, reload: load }
}

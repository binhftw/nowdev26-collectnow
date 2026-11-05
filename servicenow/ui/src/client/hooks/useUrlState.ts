import { useCallback, useEffect, useRef, useState } from 'react'

export type TabId = 'available' | 'past' | 'upcoming'

export interface UrlState {
    q: string
    cat: string
    id: string | null
    tab: TabId
}

const TABS: TabId[] = ['available', 'past', 'upcoming']

function readUrl(): UrlState {
    const p = new URLSearchParams(window.location.search)
    const tab = p.get('tab') as TabId
    return {
        q: p.get('q') || '',
        cat: p.get('cat') || '',
        id: p.get('id') || null,
        tab: TABS.includes(tab) ? tab : 'available',
    }
}

function setTitle(path: string, title: string) {
    if (window.self !== window.top) {
        // Inside the Polaris/Next Experience shell: update the outer permalink and title
        const ce = (window as any).CustomEvent
        if (ce && typeof ce.fireTop === 'function') {
            ce.fireTop('magellanNavigator.permalink.set', { relativePath: path, title })
        }
    }
    document.title = title
}

/** URL-backed SPA navigation state (?q=&cat=&id=&tab=). */
export function useUrlState() {
    const [state, setState] = useState<UrlState>(readUrl)

    useEffect(() => {
        const onPop = () => setState(readUrl())
        window.addEventListener('popstate', onPop)
        return () => window.removeEventListener('popstate', onPop)
    }, [])

    const stateRef = useRef(state)
    stateRef.current = state

    const navigate = useCallback((next: Partial<UrlState>, opts: { replace?: boolean; title?: string } = {}) => {
        const merged: UrlState = { ...stateRef.current, ...next }
        const params = new URLSearchParams()
        if (merged.q) params.set('q', merged.q)
        if (merged.cat) params.set('cat', merged.cat)
        if (merged.id) params.set('id', merged.id)
        if (merged.id && merged.tab !== 'available') params.set('tab', merged.tab)
        const qs = params.toString()
        const path = `${window.location.pathname}${qs ? `?${qs}` : ''}`
        if (opts.replace) window.history.replaceState(merged, '', path)
        else window.history.pushState(merged, '', path)
        setTitle(path, opts.title || 'Collectible Finder')
        stateRef.current = merged
        setState(merged)
    }, [])

    return { state, navigate }
}

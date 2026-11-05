import React, { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import SearchPanel from './components/SearchPanel'
import ResultsList from './components/ResultsList'
import CollectibleDetail from './components/CollectibleDetail'
import { EmptyState, ErrorState, LoadingState } from './components/States'
import { getCollectible, searchCollectibles, type Collectible } from './services/collectnow'
import { useUrlState, type TabId } from './hooks/useUrlState'

export default function App() {
    const { state, navigate } = useUrlState()
    const [results, setResults] = useState<Collectible[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retry, setRetry] = useState(0)
    const [selected, setSelected] = useState<Collectible | null>(null)
    const [selectedError, setSelectedError] = useState<string | null>(null)

    // Search whenever the query or category changes (initial load shows everything).
    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)
        searchCollectibles(state.q, state.cat)
            .then((r) => !cancelled && setResults(r))
            .catch((e: Error) => !cancelled && setError(e.message))
            .finally(() => !cancelled && setLoading(false))
        return () => {
            cancelled = true
        }
    }, [state.q, state.cat, retry])

    // Resolve the selected collectible from the URL (may not be in the current results).
    useEffect(() => {
        setSelectedError(null)
        if (!state.id) return setSelected(null)
        const hit = results.find((r) => r.sysId === state.id)
        if (hit) return setSelected(hit)
        if (selected?.sysId === state.id) return
        let cancelled = false
        getCollectible(state.id)
            .then((c) => {
                if (cancelled) return
                if (c) setSelected(c)
                else setSelectedError('That collectible could not be found.')
            })
            .catch((e: Error) => !cancelled && setSelectedError(e.message))
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.id, results])

    const onSelect = useCallback(
        (c: Collectible) => navigate({ id: c.sysId, tab: 'available' }, { title: `${c.name} - Collectible Finder` }),
        [navigate]
    )
    const onTab = useCallback((tab: TabId) => navigate({ tab }, { replace: true }), [navigate])

    const current = selected && selected.sysId === state.id ? selected : null
    let detail: React.ReactNode
    if (selectedError) detail = <ErrorState message={selectedError} />
    else if (state.id && !current) detail = <LoadingState label="Loading collectible…" />
    else if (current) detail = <CollectibleDetail collectible={current} tab={state.tab} onTab={onTab} />
    else detail = <EmptyState title="Pick a collectible" content="Select a collectible from the list to compare prices and see its drops." />

    const onSearch = (q: string) => {
        const next = q.trim()
        if (next === state.q) setRetry((n) => n + 1)
        else navigate({ q: next }, { replace: true })
    }

    return (
        <div className="cf-app">
            <Header />
            <main className="cf-main">
                <SearchPanel
                    query={state.q}
                    category={state.cat}
                    onSearch={onSearch}
                    onCategory={(cat) => navigate({ cat }, { replace: true })}
                />
                <div className="cf-layout">
                    <ResultsList
                        results={results}
                        loading={loading}
                        error={error}
                        selectedId={state.id}
                        onSelect={onSelect}
                        onRetry={() => setRetry((n) => n + 1)}
                    />
                    <div className="cf-layout__detail">{detail}</div>
                </div>
            </main>
        </div>
    )
}

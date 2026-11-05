import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tabs, type TabsSelectedItemSet } from '@servicenow/react-components/Tabs'
import { getDrops, getListings, type Collectible, type Drop, type Listing } from '../services/collectnow'
import { currentListings, dropPhase, isOldListing, summarize } from '../utils/collectibles'
import { useNow } from '../hooks/useNow'
import type { TabId } from '../hooks/useUrlState'
import DetailHeader from './DetailHeader'
import AvailableNow from './AvailableNow'
import PastHistory from './PastHistory'
import UpcomingDrops from './UpcomingDrops'
import { ErrorState, LoadingState } from './States'

interface Props {
    collectible: Collectible
    tab: TabId
    onTab: (tab: TabId) => void
}

export default function CollectibleDetail({ collectible, tab, onTab }: Props) {
    const [listings, setListings] = useState<Listing[]>([])
    const [drops, setDrops] = useState<Drop[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [reload, setReload] = useState(0)
    const now = useNow()

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)
        Promise.all([getListings(collectible.sysId), getDrops(collectible.sysId)])
            .then(([l, d]) => {
                if (cancelled) return
                setListings(l)
                setDrops(d)
            })
            .catch((e: Error) => !cancelled && setError(e.message))
            .finally(() => !cancelled && setLoading(false))
        return () => {
            cancelled = true
        }
    }, [collectible.sysId, reload])

    const view = useMemo(() => {
        const available = currentListings(listings)
        const old = listings.filter(isOldListing)
        const past = drops.filter((d) => dropPhase(d, now) === 'past')
        const upcoming = drops
            .filter((d) => dropPhase(d, now) !== 'past')
            .sort((a, b) => (a.releaseDate?.getTime() ?? 0) - (b.releaseDate?.getTime() ?? 0))
        return { available, old, past, upcoming, stats: summarize(listings, drops) }
    }, [listings, drops, now])

    const items = [
        { id: 'available', label: `Available Now (${view.available.length})` },
        { id: 'past', label: `Past Drops & Old Listings (${view.past.length + view.old.length})` },
        { id: 'upcoming', label: `Upcoming Drops (${view.upcoming.length})` },
    ]
    const handleTab = useCallback<TabsSelectedItemSet>((e) => onTab(e.detail.payload.value as TabId), [onTab])
    const activeLabel = items.find((i) => i.id === tab)?.label || ''

    let panel: React.ReactNode
    if (loading) panel = <LoadingState label="Loading listings and drops…" />
    else if (error) panel = <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
    else if (tab === 'past') panel = <PastHistory drops={view.past} listings={view.old} />
    else if (tab === 'upcoming') panel = <UpcomingDrops drops={view.upcoming} now={now} />
    else panel = <AvailableNow listings={view.available} />

    return (
        <section className="cf-detail" aria-label={`${collectible.name} details`}>
            <DetailHeader c={collectible} stats={view.stats} statsLoading={loading} />
            <Tabs
                items={items}
                selectedItem={tab}
                maxWidth={360}
                configAria={{ tablist: { 'aria-label': `${collectible.name} sections` } }}
                onSelectedItemSet={handleTab}
            />
            <div className="cf-panel" role="tabpanel" aria-label={activeLabel} aria-busy={loading}>
                {panel}
            </div>
        </section>
    )
}

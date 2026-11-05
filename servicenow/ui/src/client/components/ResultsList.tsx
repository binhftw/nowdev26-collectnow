import React from 'react'
import { Card } from '@servicenow/react-components/Card'
import { Image } from '@servicenow/react-components/Image'
import type { Collectible } from '../services/collectnow'
import { CategoryBadge } from './Badges'
import { EmptyState, ErrorState, LoadingState } from './States'

interface Props {
    results: Collectible[]
    loading: boolean
    error: string | null
    selectedId: string | null
    onSelect: (c: Collectible) => void
    onRetry: () => void
}

export const seriesLine = (c: Collectible) => [c.series, c.edition].filter(Boolean).join(' · ')

export function Thumb({ c, size }: { c: Collectible; size: number }) {
    if (c.imageUrl) {
        return (
            <span className="cf-thumb" style={{ width: size, height: size }}>
                <Image src={c.imageUrl} alt={c.name} width={size} height={size} fit="cover" />
            </span>
        )
    }
    return (
        <span className="cf-thumb cf-thumb--empty" style={{ width: size, height: size }} aria-hidden="true">
            {c.name.charAt(0).toUpperCase() || '?'}
        </span>
    )
}

export default function ResultsList({ results, loading, error, selectedId, onSelect, onRetry }: Props) {
    let body: React.ReactNode
    if (loading) body = <LoadingState label="Searching collectibles…" />
    else if (error) body = <ErrorState message={error} onRetry={onRetry} />
    else if (!results.length)
        body = <EmptyState search title="No collectibles found" content="Try a different search or category, or add one from CollectNow > New Collectible." />
    else
        body = (
            <ul className="cf-results__list">
                {results.map((c) => {
                    const selected = c.sysId === selectedId
                    return (
                        <li key={c.sysId}>
                            <Card
                                size="sm"
                                interaction="click"
                                hideShadow={!selected}
                                sidebar={selected ? { color: 'info', variant: 'primary' } : undefined}
                                configAria={{ button: { 'aria-label': `View ${c.name}`, 'aria-current': selected ? 'true' : undefined } }}
                                onClicked={() => onSelect(c)}
                            >
                                <div className="cf-result">
                                    <Thumb c={c} size={48} />
                                    <div className="cf-result__text">
                                        <span className="cf-result__name">{c.name || '(unnamed)'}</span>
                                        {seriesLine(c) && <span className="cf-muted">{seriesLine(c)}</span>}
                                        <span className="cf-result__meta">
                                            <CategoryBadge label={c.categoryLabel} />
                                            <span className="cf-muted cf-small">{c.number}</span>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </li>
                    )
                })}
            </ul>
        )

    return (
        <section className="cf-results" aria-labelledby="cf-results-title" aria-busy={loading}>
            <h2 id="cf-results-title" className="cf-section-title">
                Collectibles {!loading && !error ? <span className="cf-muted">({results.length})</span> : null}
            </h2>
            {body}
        </section>
    )
}

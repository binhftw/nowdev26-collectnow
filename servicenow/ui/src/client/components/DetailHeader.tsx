import React from 'react'
import type { Collectible } from '../services/collectnow'
import { formatPrice } from '../utils/format'
import { CategoryBadge } from './Badges'
import { Thumb, seriesLine } from './ResultsList'

interface Stats {
    lowestPrice: number | null
    storeCount: number
    dropCount: number
}

export default function DetailHeader({ c, stats, statsLoading }: { c: Collectible; stats: Stats; statsLoading: boolean }) {
    const v = (s: string) => (statsLoading ? '…' : s)
    return (
        <div className="cf-detail__header">
            <Thumb c={c} size={112} />
            <div className="cf-detail__info">
                <h2 className="cf-detail__name">{c.name || '(unnamed)'}</h2>
                <p className="cf-detail__meta">
                    <CategoryBadge label={c.categoryLabel} />
                    {seriesLine(c) && <span>{seriesLine(c)}</span>}
                    <span className="cf-muted">{c.number}</span>
                </p>
                {c.description && <p className="cf-detail__desc">{c.description}</p>}
                <dl className="cf-stats" aria-busy={statsLoading}>
                    <div className="cf-stat">
                        <dt>Lowest price now</dt>
                        <dd>{v(stats.lowestPrice === null ? 'Not available' : formatPrice(stats.lowestPrice))}</dd>
                    </div>
                    <div className="cf-stat">
                        <dt>Stores selling</dt>
                        <dd>{v(String(stats.storeCount))}</dd>
                    </div>
                    <div className="cf-stat">
                        <dt>Drops</dt>
                        <dd>{v(String(stats.dropCount))}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

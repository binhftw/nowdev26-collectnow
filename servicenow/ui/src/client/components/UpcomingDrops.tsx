import React from 'react'
import { Card } from '@servicenow/react-components/Card'
import { HighlightedValue } from '@servicenow/react-components/HighlightedValue'
import type { Drop } from '../services/collectnow'
import { dropPhase } from '../utils/collectibles'
import { formatCountdown, formatDateTime, formatPrice } from '../utils/format'
import { EmptyState } from './States'

export default function UpcomingDrops({ drops, now }: { drops: Drop[]; now: number }) {
    if (!drops.length) {
        return <EmptyState title="No upcoming drops" content="No drops scheduled — add one from CollectNow > New Drop." />
    }
    return (
        <ul className="cf-drops">
            {drops.map((d) => {
                const live = dropPhase(d, now) === 'live'
                return (
                    <li key={d.sysId}>
                        <Card size="md" sidebar={{ color: live ? 'positive' : 'info', variant: 'primary' }}>
                            <article className="cf-drop" aria-labelledby={`drop-${d.sysId}`}>
                                <header className="cf-drop__head">
                                    <h3 id={`drop-${d.sysId}`} className="cf-drop__name">
                                        {d.name || d.number}
                                    </h3>
                                    <HighlightedValue
                                        label={live ? 'Live now' : 'Upcoming'}
                                        color={live ? 'positive' : 'info'}
                                        variant={live ? 'primary' : 'secondary'}
                                        showIcon
                                    />
                                </header>
                                <p className="cf-drop__countdown" aria-live="off">
                                    {live || !d.releaseDate ? (live ? 'Live now' : 'Release date TBA') : `Drops in ${formatCountdown(d.releaseDate, now)}`}
                                </p>
                                <dl className="cf-drop__facts">
                                    <div>
                                        <dt>Store</dt>
                                        <dd>{d.storeName}</dd>
                                    </div>
                                    <div>
                                        <dt>Release</dt>
                                        <dd>
                                            <time dateTime={d.releaseDate?.toISOString()}>{formatDateTime(d.releaseDate)}</time>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Retail price</dt>
                                        <dd>{formatPrice(d.retailPrice)}</dd>
                                    </div>
                                </dl>
                            </article>
                        </Card>
                    </li>
                )
            })}
        </ul>
    )
}

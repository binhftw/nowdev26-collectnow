import React from 'react'
import { Card } from '@servicenow/react-components/Card'
import { HighlightedValue } from '@servicenow/react-components/HighlightedValue'
import { Drop } from '../services/drops'
import { Phase, countdownText, formatLocal } from '../utils/time'

const FINDER_PAGE = 'x_1234_team39_co_0_finder.do'

interface Props {
    drop: Drop
    phase: Phase
    now: number
}

export default function DropCard({ drop, phase, now }: Props) {
    const live = phase === 'live'
    const finderHref = drop.collectibleId
        ? `${FINDER_PAGE}?${new URLSearchParams({ id: drop.collectibleId, tab: 'upcoming' }).toString()}`
        : ''

    return (
        <li className="ud-item">
            <Card
                size="md"
                sidebar={{ color: live ? 'positive' : 'info', variant: 'primary' }}
                configAria={{ article: { 'aria-label': drop.title } }}
            >
                <div className="ud-card">
                    <div className="ud-card__top">
                        <h3 className="ud-card__title">{drop.title}</h3>
                        <HighlightedValue
                            label={live ? 'Live now' : 'Upcoming'}
                            color={live ? 'positive' : 'info'}
                            variant={live ? 'primary' : 'secondary'}
                        />
                    </div>
                    <p className="ud-card__countdown">{countdownText(phase, drop.release, now)}</p>
                    <dl className="ud-card__meta">
                        <div className="ud-card__row">
                            <dt>Collectible</dt>
                            <dd>{drop.collectibleName || 'No collectible linked'}</dd>
                        </div>
                        <div className="ud-card__row">
                            <dt>Store</dt>
                            <dd>{drop.storeName || '—'}</dd>
                        </div>
                        <div className="ud-card__row">
                            <dt>Release</dt>
                            <dd>
                                {drop.release ? (
                                    <time dateTime={drop.release.toISOString()}>{formatLocal(drop.release)}</time>
                                ) : (
                                    'TBA'
                                )}
                            </dd>
                        </div>
                        <div className="ud-card__row">
                            <dt>Retail price</dt>
                            <dd>{drop.price}</dd>
                        </div>
                    </dl>
                    {finderHref && (
                        <a
                            className="ud-link"
                            href={finderHref}
                            aria-label={`View ${drop.title} in Collectible Finder`}
                        >
                            View in Collectible Finder
                        </a>
                    )}
                </div>
            </Card>
        </li>
    )
}

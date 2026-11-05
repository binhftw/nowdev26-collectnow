import React from 'react'
import { HighlightedValue } from '@servicenow/react-components/HighlightedValue'
import type { Listing } from '../services/collectnow'
import { formatPrice } from '../utils/format'
import { AvailabilityBadge } from './Badges'
import ExternalLink from './ExternalLink'
import { EmptyState } from './States'

export default function AvailableNow({ listings }: { listings: Listing[] }) {
    if (!listings.length) {
        return (
            <EmptyState
                title="Nothing available right now"
                content="No listings yet — add one from CollectNow > New Store Listing."
            />
        )
    }
    const bestId = listings[0].price !== null ? listings[0].sysId : null
    return (
        <div className="cf-table-wrap">
            <table className="cf-table">
                <caption className="cf-visually-hidden">Current listings sorted by price, lowest first</caption>
                <thead>
                    <tr>
                        <th scope="col">Store</th>
                        <th scope="col">Condition</th>
                        <th scope="col" className="cf-num">Price</th>
                        <th scope="col">Availability</th>
                        <th scope="col">
                            <span className="cf-visually-hidden">Link</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((l) => {
                        const best = l.sysId === bestId
                        return (
                            <tr key={l.sysId} className={best ? 'cf-row--best' : undefined}>
                                <th scope="row" className="cf-cell-strong">
                                    {l.storeName}
                                    {best && (
                                        <span className="cf-inline-badge">
                                            <HighlightedValue label="Best price" color="positive" variant="primary" icon="star-fill" showIcon />
                                        </span>
                                    )}
                                </th>
                                <td>{l.condition || '—'}</td>
                                <td className="cf-num cf-price">{formatPrice(l.price)}</td>
                                <td>
                                    <AvailabilityBadge value={l.availability} label={l.availabilityLabel} />
                                </td>
                                <td>
                                    <ExternalLink href={l.url} label="View" context={`listing at ${l.storeName}`} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

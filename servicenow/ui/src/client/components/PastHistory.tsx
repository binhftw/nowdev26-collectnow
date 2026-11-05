import React from 'react'
import type { Drop, Listing } from '../services/collectnow'
import { formatDate, formatDateTime, formatPrice } from '../utils/format'
import { AvailabilityBadge } from './Badges'
import { EmptyState } from './States'

const newest = (a: Date | null, b: Date | null) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0)

export default function PastHistory({ drops, listings }: { drops: Drop[]; listings: Listing[] }) {
    const pastDrops = [...drops].sort((a, b) => newest(a.releaseDate, b.releaseDate))
    const oldListings = [...listings].sort((a, b) => newest(a.dateListed, b.dateListed))
    return (
        <div className="cf-stack">
            <section aria-labelledby="cf-past-drops">
                <h3 id="cf-past-drops" className="cf-subtitle">
                    Past drops ({pastDrops.length})
                </h3>
                {pastDrops.length ? (
                    <div className="cf-table-wrap">
                        <table className="cf-table">
                            <thead>
                                <tr>
                                    <th scope="col">Drop</th>
                                    <th scope="col">Store</th>
                                    <th scope="col">Release date</th>
                                    <th scope="col" className="cf-num">Retail price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastDrops.map((d) => (
                                    <tr key={d.sysId}>
                                        <th scope="row" className="cf-cell-strong">{d.name || d.number}</th>
                                        <td>{d.storeName}</td>
                                        <td>{formatDateTime(d.releaseDate)}</td>
                                        <td className="cf-num">{formatPrice(d.retailPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState title="No past drops" content="Past drops appear here once their release window has closed." />
                )}
            </section>
            <section aria-labelledby="cf-old-listings">
                <h3 id="cf-old-listings" className="cf-subtitle">
                    Old listings ({oldListings.length})
                </h3>
                {oldListings.length ? (
                    <div className="cf-table-wrap">
                        <table className="cf-table">
                            <thead>
                                <tr>
                                    <th scope="col">Store</th>
                                    <th scope="col">Condition</th>
                                    <th scope="col" className="cf-num">Price</th>
                                    <th scope="col">Availability</th>
                                    <th scope="col">Date listed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oldListings.map((l) => (
                                    <tr key={l.sysId}>
                                        <th scope="row" className="cf-cell-strong">{l.storeName}</th>
                                        <td>{l.condition || '—'}</td>
                                        <td className="cf-num">{formatPrice(l.price)}</td>
                                        <td>
                                            <AvailabilityBadge value={l.availability} label={l.availabilityLabel} />
                                        </td>
                                        <td>{formatDate(l.dateListed)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState title="No old listings" content="Sold out and ended listings will show up here." />
                )}
            </section>
        </div>
    )
}

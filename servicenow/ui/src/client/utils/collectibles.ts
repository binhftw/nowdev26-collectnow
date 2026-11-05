import type { Drop, Listing } from '../services/collectnow'

export type DropPhase = 'upcoming' | 'live' | 'past'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Computes the drop phase from its dates (the stored status only refreshes on save).
 * No end date means the drop is live for 24h after release.
 */
export function dropPhase(drop: Drop, now: number): DropPhase {
    if (!drop.releaseDate) return 'upcoming'
    const start = drop.releaseDate.getTime()
    if (now < start) return 'upcoming'
    const end = drop.endDate ? drop.endDate.getTime() : start + DAY_MS
    return now < end ? 'live' : 'past'
}

export const isCurrentListing = (l: Listing) => l.availability === 'in_stock' || l.availability === 'low_stock'
export const isOldListing = (l: Listing) => l.availability === 'sold_out' || l.availability === 'ended'

export function currentListings(listings: Listing[]): Listing[] {
    return listings
        .filter(isCurrentListing)
        .sort((a, b) => (a.price ?? Number.MAX_VALUE) - (b.price ?? Number.MAX_VALUE))
}

export function summarize(listings: Listing[], drops: Drop[]) {
    const current = currentListings(listings)
    const priced = current.filter((l) => l.price !== null)
    return {
        lowestPrice: priced.length ? (priced[0].price as number) : null,
        storeCount: new Set(current.map((l) => l.storeId || l.storeName)).size,
        dropCount: drops.length,
    }
}

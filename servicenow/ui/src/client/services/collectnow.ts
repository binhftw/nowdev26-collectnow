import { getRecords } from './api'
import { display, value, type SnRecord } from '../utils/fields'
import { parseSnDate } from '../utils/format'

const T = {
    collectible: 'x_1234_team39_co_0_collectible',
    listing: 'x_1234_team39_co_0_listing',
    drop: 'x_1234_team39_co_0_drop',
}

export interface Collectible {
    sysId: string
    number: string
    name: string
    category: string
    categoryLabel: string
    series: string
    edition: string
    imageUrl: string | null
    description: string
}

export interface Listing {
    sysId: string
    number: string
    storeId: string
    storeName: string
    price: number | null
    condition: string
    availability: string
    availabilityLabel: string
    url: string
    dateListed: Date | null
}

export interface Drop {
    sysId: string
    number: string
    name: string
    storeName: string
    releaseDate: Date | null
    endDate: Date | null
    retailPrice: number | null
}

const num = (s: string): number | null => (s === '' || isNaN(Number(s)) ? null : Number(s))

/** Image fields store an attachment id; build a URL the browser can load. */
function imageUrl(rec: SnRecord): string | null {
    const v = value(rec.image)
    if (!v) return null
    if (/^[0-9a-f]{32}$/i.test(v)) return `/sys_attachment.do?sys_id=${v}`
    return v.startsWith('/') || v.startsWith('http') ? v : `/${v}`
}

const toCollectible = (r: SnRecord): Collectible => ({
    sysId: value(r.sys_id),
    number: display(r.number),
    name: display(r.name),
    category: value(r.category),
    categoryLabel: display(r.category),
    series: display(r.series),
    edition: display(r.edition),
    imageUrl: imageUrl(r),
    description: display(r.description),
})

const toListing = (r: SnRecord): Listing => ({
    sysId: value(r.sys_id),
    number: display(r.number),
    storeId: value(r.store),
    storeName: display(r.store) || 'Unknown store',
    price: num(value(r.price)),
    condition: display(r.item_condition),
    availability: value(r.availability),
    availabilityLabel: display(r.availability),
    url: value(r.listing_url),
    dateListed: parseSnDate(value(r.date_listed)),
})

const toDrop = (r: SnRecord): Drop => ({
    sysId: value(r.sys_id),
    number: display(r.number),
    name: display(r.name),
    storeName: display(r.store) || 'Unknown store',
    releaseDate: parseSnDate(value(r.release_date)),
    endDate: parseSnDate(value(r.end_date)),
    retailPrice: num(value(r.retail_price)),
})

/** Strip characters that would break an encoded query. */
const clean = (s: string) => s.replace(/[\^=]/g, ' ').trim()

export async function searchCollectibles(text: string, category: string): Promise<Collectible[]> {
    const q = clean(text)
    const parts: string[] = []
    if (q) parts.push(`nameLIKE${q}^ORseriesLIKE${q}^OReditionLIKE${q}`)
    if (category) parts.push(`category=${clean(category)}`)
    parts.push('ORDERBYname')
    const rows = await getRecords(T.collectible, {
        query: parts.join('^'),
        fields: ['number', 'name', 'category', 'series', 'edition', 'image', 'description'],
        limit: 50,
    })
    return rows.map(toCollectible)
}

export async function getCollectible(sysId: string): Promise<Collectible | null> {
    const rows = await getRecords(T.collectible, {
        query: `sys_id=${clean(sysId)}`,
        fields: ['number', 'name', 'category', 'series', 'edition', 'image', 'description'],
        limit: 1,
    })
    return rows.length ? toCollectible(rows[0]) : null
}

export async function getListings(collectibleId: string): Promise<Listing[]> {
    const rows = await getRecords(T.listing, {
        query: `collectible=${clean(collectibleId)}^ORDERBYprice`,
        fields: ['number', 'store', 'price', 'item_condition', 'availability', 'listing_url', 'date_listed'],
        limit: 500,
    })
    return rows.map(toListing)
}

export async function getDrops(collectibleId: string): Promise<Drop[]> {
    const rows = await getRecords(T.drop, {
        query: `collectible=${clean(collectibleId)}^ORDERBYrelease_date`,
        fields: ['number', 'name', 'store', 'release_date', 'end_date', 'retail_price'],
        limit: 500,
    })
    return rows.map(toDrop)
}

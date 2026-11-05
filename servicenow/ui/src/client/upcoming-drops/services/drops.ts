import { display, value, Field } from '../utils/fields'
import { parseUtc, toUtcString, DAY } from '../utils/time'

const TABLE = 'x_1234_team39_co_0_drop'
const FIELDS = 'sys_id,number,name,collectible,store,release_date,end_date,retail_price'

export interface Drop {
    sysId: string
    title: string
    collectibleId: string
    collectibleName: string
    storeName: string
    releaseRaw: string
    release: Date | null
    end: Date | null
    price: string
}

type Row = Record<string, Field>

const usd = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

function formatPrice(field: Field): string {
    const raw = value(field)
    if (!raw) return '—'
    const num = parseFloat(raw.includes(';') ? raw.split(';').pop() || '' : raw.replace(/[^0-9.-]/g, ''))
    if (isNaN(num)) return display(field) || '—'
    return usd.format(num)
}

function toDrop(row: Row): Drop {
    const releaseRaw = value(row.release_date)
    return {
        sysId: value(row.sys_id),
        title: display(row.name) || display(row.number) || value(row.number) || 'Untitled drop',
        collectibleId: value(row.collectible),
        collectibleName: display(row.collectible),
        storeName: display(row.store),
        releaseRaw,
        release: parseUtc(releaseRaw),
        end: parseUtc(value(row.end_date)),
        price: formatPrice(row.retail_price),
    }
}

export async function fetchDrops(signal?: AbortSignal): Promise<Drop[]> {
    const now = new Date()
    const nowStr = toUtcString(now)
    const now24hStr = toUtcString(new Date(now.getTime() - DAY))
    const params = new URLSearchParams({
        sysparm_query: `end_date>${nowStr}^ORrelease_date>${now24hStr}^ORDERBYrelease_date`,
        sysparm_fields: FIELDS,
        sysparm_limit: '200',
        sysparm_display_value: 'all',
        sysparm_exclude_reference_link: 'true',
    })
    const res = await fetch(`/api/now/table/${TABLE}?${params.toString()}`, {
        method: 'GET',
        credentials: 'same-origin',
        signal,
        headers: {
            Accept: 'application/json',
            'X-UserToken': (window as any).g_ck,
        },
    })
    if (!res.ok) {
        throw new Error(`Could not load drops (HTTP ${res.status}).`)
    }
    const body = await res.json()
    const rows: Row[] = Array.isArray(body?.result) ? body.result : []
    return rows.map(toDrop)
}

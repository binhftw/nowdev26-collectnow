const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateTimeFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

/** Table API raw date/time values are UTC "YYYY-MM-DD HH:mm:ss". */
export function parseSnDate(raw: string): Date | null {
    if (!raw) return null
    const iso = raw.includes('T') ? raw : `${raw.replace(' ', 'T')}${raw.length > 10 ? 'Z' : 'T00:00:00Z'}`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d
}

export const formatPrice = (n: number | null): string => (n === null ? '—' : usd.format(n))
export const formatDateTime = (d: Date | null): string => (d ? dateTimeFmt.format(d) : '—')
export const formatDate = (d: Date | null): string => (d ? dateFmt.format(d) : '—')

/** "3d 14h 22m" until the target time (minute precision). */
export function formatCountdown(target: Date, now: number): string {
    let mins = Math.max(0, Math.ceil((target.getTime() - now) / 60000))
    const d = Math.floor(mins / 1440)
    mins -= d * 1440
    const h = Math.floor(mins / 60)
    const m = mins - h * 60
    if (d > 0) return `${d}d ${h}h ${m}m`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
}

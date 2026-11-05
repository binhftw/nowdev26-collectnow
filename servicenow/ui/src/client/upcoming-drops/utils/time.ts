export type Phase = 'upcoming' | 'live' | 'past'

const DAY_MS = 24 * 60 * 60 * 1000
const pad = (n: number) => String(n).padStart(2, '0')

/** Parses a raw ServiceNow UTC date/time ("YYYY-MM-DD HH:mm:ss"). */
export function parseUtc(raw: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(raw || '')
    if (!m) return null
    const ms = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0))
    return isNaN(ms) ? null : new Date(ms)
}

/** Formats a Date as a ServiceNow UTC date/time string. */
export function toUtcString(d: Date): string {
    return (
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
    )
}

/** Mirrors the app rule: end = end_date, or release + 24h when there is no end_date. */
export function getPhase(release: Date | null, end: Date | null, now: number): Phase {
    if (!release) return 'upcoming'
    if (now < release.getTime()) return 'upcoming'
    const endMs = end ? end.getTime() : release.getTime() + DAY_MS
    return now < endMs ? 'live' : 'past'
}

/** "Drops in 3d 14h 22m" with minute precision. */
export function countdownText(phase: Phase, release: Date | null, now: number): string {
    if (phase === 'live') return 'Live now'
    if (!release) return 'Release date TBA'
    const totalMin = Math.floor((release.getTime() - now) / 60000)
    if (totalMin < 1) return 'Drops in under a minute'
    const d = Math.floor(totalMin / 1440)
    const h = Math.floor((totalMin % 1440) / 60)
    const m = totalMin % 60
    const parts: string[] = []
    if (d > 0) parts.push(`${d}d`)
    if (d > 0 || h > 0) parts.push(`${h}h`)
    parts.push(`${m}m`)
    return `Drops in ${parts.join(' ')}`
}

export function formatLocal(d: Date): string {
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export const DAY = DAY_MS

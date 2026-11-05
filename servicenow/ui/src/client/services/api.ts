import type { SnRecord } from '../utils/fields'

export class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

interface TableQuery {
    query: string
    fields: string[]
    limit?: number
}

/** GET /api/now/table/<table> with display values for every field. */
export async function getRecords(table: string, { query, fields, limit = 100 }: TableQuery): Promise<SnRecord[]> {
    const params = new URLSearchParams({
        sysparm_query: query,
        sysparm_fields: ['sys_id', ...fields].join(','),
        sysparm_display_value: 'all',
        sysparm_exclude_reference_link: 'true',
        sysparm_limit: String(limit),
    })
    const response = await fetch(`/api/now/table/${table}?${params.toString()}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-UserToken': window.g_ck || '',
        },
    })
    if (!response.ok) {
        let detail = response.statusText
        try {
            const body = await response.json()
            detail = body?.error?.message || detail
        } catch {
            /* non-JSON error body */
        }
        throw new ApiError(`Request to ${table} failed (${response.status}): ${detail}`, response.status)
    }
    const body = await response.json()
    return (body?.result || []) as SnRecord[]
}

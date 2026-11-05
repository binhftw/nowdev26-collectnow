/** A field as returned by the Table API with sysparm_display_value=all */
export interface SnField {
    value: string
    display_value: string
}

export type SnRecord = Record<string, SnField | undefined>

export const display = (field?: SnField): string => field?.display_value || ''
export const value = (field?: SnField): string => field?.value || ''

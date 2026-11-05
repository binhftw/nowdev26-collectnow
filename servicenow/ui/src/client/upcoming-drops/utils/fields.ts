export type Field = { value?: string; display_value?: string } | undefined

export const display = (field: Field): string => field?.display_value || ''
export const value = (field: Field): string => field?.value || ''

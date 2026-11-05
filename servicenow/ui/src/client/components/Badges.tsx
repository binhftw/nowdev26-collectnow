import React from 'react'
import { HighlightedValue } from '@servicenow/react-components/HighlightedValue'

type Color = 'positive' | 'warning' | 'critical' | 'low' | 'info'

const AVAILABILITY: Record<string, Color> = {
    in_stock: 'positive',
    low_stock: 'warning',
    sold_out: 'critical',
    ended: 'low',
}

export function AvailabilityBadge({ value, label }: { value: string; label: string }) {
    return <HighlightedValue label={label || value || 'Unknown'} color={AVAILABILITY[value] || 'low'} showIcon />
}

export function CategoryBadge({ label }: { label: string }) {
    return label ? <HighlightedValue label={label} color="info" /> : null
}

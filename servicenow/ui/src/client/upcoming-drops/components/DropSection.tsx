import React from 'react'
import DropCard from './DropCard'
import { Drop } from '../services/drops'
import { Phase } from '../utils/time'

export interface PhasedDrop {
    drop: Drop
    phase: Phase
}

interface Props {
    id: string
    title: string
    items: PhasedDrop[]
    now: number
}

export default function DropSection({ id, title, items, now }: Props) {
    if (items.length === 0) return null
    const headingId = `${id}-heading`
    const label = items.length === 1 ? '1 drop' : `${items.length} drops`

    return (
        <section className="ud-section" aria-labelledby={headingId}>
            <h2 id={headingId} className="ud-section__title">
                {title}
                <span className="ud-section__count">
                    <span aria-hidden="true">{items.length}</span>
                    <span className="ud-visually-hidden">, {label}</span>
                </span>
            </h2>
            <ul className="ud-grid">
                {items.map(({ drop, phase }) => (
                    <React.Fragment key={drop.sysId}>
                        <DropCard drop={drop} phase={phase} now={now} />
                    </React.Fragment>
                ))}
            </ul>
        </section>
    )
}

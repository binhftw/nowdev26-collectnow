import React, { useEffect, useState } from 'react'
import { Input, type InputInput, type InputEnterKeydown } from '@servicenow/react-components/Input'
import { Button } from '@servicenow/react-components/Button'

export const CATEGORIES = [
    { id: '', label: 'All' },
    { id: 'pokemon', label: 'Pokémon' },
    { id: 'labubu', label: 'Labubu' },
    { id: 'sports_cards', label: 'Sports Cards' },
    { id: 'other', label: 'Other' },
]

interface Props {
    query: string
    category: string
    onSearch: (query: string) => void
    onCategory: (category: string) => void
}

export default function SearchPanel({ query, category, onSearch, onCategory }: Props) {
    const [text, setText] = useState(query)
    useEffect(() => setText(query), [query])

    const handleInput: InputInput = (e) => setText(e.detail.payload.fieldValue ?? '')
    const handleEnter: InputEnterKeydown = (e) => onSearch(e.detail.payload.fieldValue ?? text)

    return (
        <section className="cf-search" aria-labelledby="cf-search-title">
            <h2 id="cf-search-title" className="cf-visually-hidden">
                Search collectibles
            </h2>
            <form
                className="cf-search__form"
                role="search"
                onSubmit={(e) => {
                    e.preventDefault()
                    onSearch(text)
                }}
            >
                <div className="cf-search__input">
                    <Input
                        label="Search by name, series or edition"
                        placeholder="e.g. Charizard, Big Into Energy, Prizm"
                        value={text}
                        onInput={handleInput}
                        onEnterKeydown={handleEnter}
                    />
                </div>
                <Button label="Search" variant="primary" icon="magnifying-glass-outline" onClicked={() => onSearch(text)} />
            </form>
            <div className="cf-chips" role="group" aria-label="Filter by category">
                {CATEGORIES.map((c) => (
                    <Button
                        key={c.id || 'all'}
                        label={c.label}
                        size="sm"
                        variant={category === c.id ? 'primary' : 'secondary'}
                        configAria={{ 'aria-pressed': category === c.id ? 'true' : 'false' }}
                        onClicked={() => onCategory(c.id)}
                    />
                ))}
            </div>
        </section>
    )
}

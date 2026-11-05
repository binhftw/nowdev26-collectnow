import React from 'react'
import { Loader } from '@servicenow/react-components/Loader'
import { TemplateMessage } from '@servicenow/react-components/TemplateMessage'

export function LoadingState({ label }: { label: string }) {
    return (
        <div className="cf-state" role="status" aria-live="polite">
            <Loader label={label} size="md" />
        </div>
    )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="cf-state" role="alert">
            <TemplateMessage
                heading={{ label: 'Something went wrong', level: 3 }}
                content={`We couldn't load this data. ${message}`}
                illustration="error"
                actions={onRetry ? [{ label: 'Try again', variant: 'secondary' }] : undefined}
                onActionClicked={() => onRetry?.()}
            />
        </div>
    )
}

export function EmptyState({ title, content, search }: { title: string; content: string; search?: boolean }) {
    return (
        <div className="cf-state">
            <TemplateMessage
                heading={{ label: title, level: 3 }}
                content={content}
                illustration={search ? 'no-search-results' : 'no-data'}
            />
        </div>
    )
}

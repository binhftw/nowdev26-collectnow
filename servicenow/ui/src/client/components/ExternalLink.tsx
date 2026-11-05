import React from 'react'

/** Opens an external listing in a new tab without exposing window.opener. */
export default function ExternalLink({ href, label, context }: { href: string; label: string; context: string }) {
    if (!/^https?:\/\//i.test(href)) return <span className="cf-muted">—</span>
    return (
        <a className="cf-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${context} (opens in a new tab)`}>
            {label}
            <svg className="cf-link__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M9 2h5v5h-1.5V4.56L7.53 9.53 6.47 8.47l4.97-4.97H9V2zM3 4h4v1.5H4.5v6h6V9H12v4H3V4z" />
            </svg>
        </a>
    )
}

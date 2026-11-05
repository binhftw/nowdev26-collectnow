import React, { useEffect, useMemo } from 'react'
import { Button } from '@servicenow/react-components/Button'
import { Loader } from '@servicenow/react-components/Loader'
import { TemplateMessage } from '@servicenow/react-components/TemplateMessage'
import DropSection, { PhasedDrop } from './components/DropSection'
import { useDrops } from './hooks/useDrops'
import { useMinuteNow } from './hooks/useMinuteNow'
import { getPhase } from './utils/time'

const PAGE_TITLE = 'Upcoming Drops'

function updatePageTitle(title: string) {
    if (window.self !== window.top) {
        ;(window as any).CustomEvent?.fireTop?.('magellanNavigator.permalink.set', {
            relativePath: window.location.pathname + window.location.search,
            title,
        })
    }
    document.title = title
}

export default function UpcomingDropsApp() {
    const { status, drops, error, reload } = useDrops()
    const now = useMinuteNow()

    useEffect(() => updatePageTitle(PAGE_TITLE), [])

    const { live, upcoming } = useMemo(() => {
        const phased: PhasedDrop[] = drops
            .map((drop) => ({ drop, phase: getPhase(drop.release, drop.end, now) }))
            .filter((p) => p.phase !== 'past')
            .sort((a, b) => {
                const at = a.drop.release ? a.drop.release.getTime() : Number.MAX_SAFE_INTEGER
                const bt = b.drop.release ? b.drop.release.getTime() : Number.MAX_SAFE_INTEGER
                return at - bt
            })
        return {
            live: phased.filter((p) => p.phase === 'live'),
            upcoming: phased.filter((p) => p.phase === 'upcoming'),
        }
    }, [drops, now])

    return (
        <main className="ud-page">
            <header className="ud-header">
                <div className="ud-header__text">
                    <h1 className="ud-header__title">Upcoming Drops</h1>
                    <p className="ud-header__subtitle">
                        Every upcoming and live drop across all collectibles, soonest first.
                    </p>
                </div>
                <Button label="Refresh" variant="secondary" disabled={status === 'loading'} onClicked={reload} />
            </header>

            {status === 'loading' && (
                <div className="ud-status" role="status">
                    <Loader label="Loading drops" />
                </div>
            )}

            {status === 'error' && (
                <div className="ud-status" role="alert">
                    <TemplateMessage
                        heading={{ label: 'Drops could not be loaded', level: 2 }}
                        content={error || 'Something went wrong.'}
                        illustration="error"
                        actions={[{ label: 'Try again', variant: 'primary' }]}
                        onActionClicked={reload}
                    />
                </div>
            )}

            {status === 'ready' && live.length === 0 && upcoming.length === 0 && (
                <div className="ud-status">
                    <TemplateMessage
                        heading={{ label: 'No upcoming drops', level: 2 }}
                        content="Nothing is scheduled right now."
                        illustration="no-data"
                    />
                </div>
            )}

            {status === 'ready' && (
                <>
                    <DropSection id="ud-live" title="Live now" items={live} now={now} />
                    <DropSection id="ud-upcoming" title="Upcoming" items={upcoming} now={now} />
                </>
            )}
        </main>
    )
}

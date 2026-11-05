import React from 'react'
import ReactDOM from 'react-dom/client'
import UpcomingDropsApp from './upcoming-drops/UpcomingDropsApp'
import './upcoming-drops/upcoming-drops.css'

const rootEl = document.getElementById('root')
if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<UpcomingDropsApp />)
}

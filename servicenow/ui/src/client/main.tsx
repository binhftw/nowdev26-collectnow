import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './styles/app.css'

const rootEl = document.getElementById('root')
if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<App />)
}

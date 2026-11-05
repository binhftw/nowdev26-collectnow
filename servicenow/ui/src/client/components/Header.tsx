import React from 'react'

export default function Header() {
    return (
        <header className="cf-header">
            <div className="cf-header__inner">
                <p className="cf-header__brand">
                    <span aria-hidden="true" className="cf-header__mark">
                        CN
                    </span>
                    <span>CollectNow</span>
                </p>
                <p className="cf-header__tagline">Find your grail.</p>
            </div>
        </header>
    )
}

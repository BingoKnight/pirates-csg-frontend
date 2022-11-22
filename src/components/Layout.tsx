import React, { useState, useEffect } from 'react'

import Header from './Header.tsx'

import '../styles/layout.scss'

function Layout({ children }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    function updateWindowWidth() {
    }

    useEffect(() => {
        updateWindowWidth()
        window.addEventListener('resize', updateWindowWidth)
        return () => window.removeEventListener('resize', updateWindowWidth)
    })

    return (
        <div>
            <Header />
            <div className="container">
                <div id='page-content-backdrop' />
                <div className="page-content">{children}</div>
            </div>
        </div>
    )
}

export default Layout

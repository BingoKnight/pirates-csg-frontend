import React, { useState, useEffect } from 'react'

import Header from './Header.tsx'

import '../styles/layout.scss'

function Layout({ children }) {
    return (
        <div>
            <div id="backdrops">
                <div id="header-backdrop" />
                <div id="page-content-backdrop" />
            </div>
            <Header />
            <div className="container">
                <div className="page-content">{children}</div>
            </div>
        </div>
    )
}

export default Layout

import React from 'react'

import Loading from './Loading.tsx'

import '../styles/login-registration.scss'

export function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <Loading />
            <div className="empty-row"></div>
        </div>
    )
}


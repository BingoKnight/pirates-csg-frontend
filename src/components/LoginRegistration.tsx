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

export function ValidationErrors({ validationErrors, closeHandler }) {
    return (
        <div className="validation-errors">
            {validationErrors.map((error: string, index: number) => {
                return <div className='row error-item'>
                    <div className="col error-message">{error}</div>
                    <div className="col close-icon" onClick={() => closeHandler(index)}>&times;</div>
                </div>
            })}
        </div>
    )
}


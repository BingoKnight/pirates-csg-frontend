import React from 'react'
import { ReactComponent as ShipWheel } from '../images/ship-wheel.svg'

import '../styles/loading.scss'

export default function Loading() {
    return (
        <div className="loading-container">
            <ShipWheel className='loading-icon'/>
        </div>
    )
}


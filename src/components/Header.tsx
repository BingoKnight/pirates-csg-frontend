import React from 'react'

import '../styles/header.scss'

export default function Header() {
    return (
        <div className='row header-row'>
            <div className='col header-title noselect'>
                Pirates CSG Database
            </div>
            <div className="col" id="empty-col"></div>
        </div>
    )
}



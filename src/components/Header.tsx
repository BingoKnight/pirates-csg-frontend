import React from 'react'

import Image from './Image.tsx'
import ShipImage from '../images/ship-logo.png'

import '../styles/header.scss'

export default function Header() {
    return (
        <div className='row header-row'>
            <div className='col header-title noselect'>
                Pirates CSG Database
            </div>
            <div className="col header-logo noselect">
                <Image src={ShipImage} alt="Logo" height="50px"/>
            </div>
            <div className="col" id="empty-col"></div>
        </div>
    )
}



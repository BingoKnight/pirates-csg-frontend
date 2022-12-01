import React from 'react'
import { Link } from 'react-router-dom'

import Image from './Image.tsx'
import ShipImage from '../images/ship-logo.png'

import '../styles/header.scss'

export default function Header() {
    return (
        <div className="row header-row">
            <div className="col header-title">
                <Link className="title-link" to="/">
                    <span>Pirates CSG Database</span>
                    <Image src={ShipImage} alt="Logo" height="50px"/>
                </Link>
            </div>
        </div>
    )
}



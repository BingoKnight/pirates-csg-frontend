import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { LinkButton } from  './Button.tsx'
import Image from './Image.tsx'
import ShipImage from '../images/ship-logo.png'
import { PHONE_VIEW, TABLET_VIEW } from '../constants.js'

import '../styles/header.scss'

function MobileMenuModal() {
}

function HamburgerMenu() {
    return (
        <svg viewBox="0 0 100 100">
            <path id={'menu-path-1'} className={isMenuActive ? 'active' : ''} d="M20,25 l60,0 0,10 -60,0" />
            <path id={'menu-path-2'} className={isMenuActive ? 'active' : ''} d="M20,45 l60,0 0,10 -60,0"/>
            <path id={'menu-path-3'} className={isMenuActive ? 'active' : ''} d="M20,65 l60,0 0,10 -60,0"/>
        </svg>
    )
}

export default function Header() {
    const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)

    function updateWindowWidth() {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth)
        return () => window.removeEventListener('resize', updateWindowWidth)
    })

    return (
        <div className="row header-row">
            <div className="col header-title">
                <Link className="title-link" to="/">
                    { windowWidth > PHONE_VIEW && <span>Pirates CSG Database</span> }
                    <Image src={ShipImage} alt="Logo" height="50px"/>
                </Link>
                <LinkButton className="login-button" to="/login">Login</LinkButton>
            </div>
        </div>
    )
}



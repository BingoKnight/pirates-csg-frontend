import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { logoutUser } from '../api.js'
import { LinkButton } from  './Button.tsx'
import Image from './Image.tsx'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import ShipImage from '../images/ship-logo.png'
import { PHONE_VIEW, TABLET_VIEW } from '../constants.js'
import { getCookie } from '../utils/cookies.ts'

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

function UserDropDown({ username }) {
    const [isActive, setIsActive] = useState(false)

    const dropdownContentRef = useRef(null)

    const navigate = useNavigate()

    function toggleIsActive() {
        setIsActive(!isActive)
    }

    function handleLogout() {
        logoutUser(getCookie('x-token'))
        navigate(0)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownContentRef.current && !dropdownContentRef.current.contains(event.target)) {
                setIsActive(false)
            }
        }

        document.addEventListener('mouseup', handleClickOutside)

        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [dropdownContentRef])

    return (
        <div ref={dropdownContentRef} className="user-dropdown noselect">
            <div className={'user-dropdown-header' + (isActive ? ' active': '')} onClick={toggleIsActive}>
                {username} <DownArrow className={'dropdown-arrow' + (isActive ? ' active': '')} />
            </div>
            <div className={'user-dropdown-content' + (isActive ? ' active': '')}>
                <ul>
                    <li className='user-dropdown-button' onClick={() => navigate('/account-settings')}>Settings</li>
                    <li className='user-dropdown-button' onClick={handleLogout}>Log out</li>
                </ul>
            </div>
        </div>
    )
}

export default function Header() {
    const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)

    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    const isLoggedIn = getCookie('x-token') && user.username && user.email

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
                { isLoggedIn ? 
                    <UserDropDown username={user.username} />
                    : <LinkButton className="login-button" to="/login">Login</LinkButton>
                }
            </div>
        </div>
    )
}



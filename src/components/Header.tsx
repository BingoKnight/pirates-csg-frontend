import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { getUser, logoutUser } from '../api.js'
import { LinkButton } from  './Button.tsx'
import Image from './Image.tsx'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import ShipImage from '../images/ship-logo.png'
import { PHONE_VIEW, TABLET_VIEW } from '../constants.js'
import { getCookie } from '../utils/cookies.ts'
import { useStatefulNavigate } from '../utils/hooks.ts'

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

    const navigate = useStatefulNavigate()

    function toggleIsActive() {
        setIsActive(!isActive)
    }

    function handleLogout() {
        logoutUser()
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
                    <li className='user-dropdown-button' onClick={() => navigate('/user/account-settings')}>Settings</li>
                    <li className='user-dropdown-button' onClick={handleLogout}>Log out</li>
                </ul>
            </div>
        </div>
    )
}

function NavBar({ user }) {
    const location = useLocation()

    const links = [
        {
            name: 'Home',
            path: '/',
            isVisible: true
        },
        {
            name: 'Collection',
            path: '/collection',
            isVisible: Boolean(user)
        }
    ]

    return (
        <div className="nav-bar row">
            {
                links
                    .filter(link => link.isVisible)
                    .map(link => (
                        <LinkButton to={link.path} className={'nav-link' + (location.pathname === link.path ? ' active' : '')}>{link.name}</LinkButton>
                    ))
            }
        </div>
    )
}

export default function Header() {
    const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)
    const [user, setUser] = useState(undefined)

    function updateWindowWidth() {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth)
        return () => window.removeEventListener('resize', updateWindowWidth)
    })

    useEffect(() => {
        getUser().then(setUser)
    }, [])

    return (
        <>
            <div className="row header-row">
                <div className="col header-title">
                    <Link className="title-link" to="/">
                        { windowWidth > PHONE_VIEW && <span>Pirates CSG Database</span> }
                        <Image src={ShipImage} alt="Logo" height="50px"/>
                    </Link>
                    <NavBar user={user} />
                    { user ?
                        <UserDropDown username={user.username} />
                        : <LinkButton className="login-button" to="/login">Login</LinkButton>
                    }
                </div>
            </div>
        </>
    )
}



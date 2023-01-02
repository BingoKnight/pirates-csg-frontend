import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { getUser, logoutUser } from '../api.js'
import { LinkButton } from  './Button.tsx'
import { PHONE_VIEW, TABLET_VIEW } from '../constants.js'
import Image from './Image.tsx'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import { ReactComponent as HomeIcon } from '../images/home-solid.svg'
import { ReactComponent as LogoutIcon } from '../images/logout-solid.svg'
import { ReactComponent as LoginIcon } from '../images/login-solid.svg'
import { ReactComponent as GearIcon } from '../images/gear-solid.svg'
import { ReactComponent as CollectionIcon } from '../images/field-icons/cards.svg'
import ShipImage from '../images/ship-logo.png'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/header.scss'

function useOutsideClickRef(callback) {
    const element = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (element.current && !element.current.contains(event.target)) {
                callback(false)
            }
        }

        document.addEventListener('mouseup', handleClickOutside)

        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [element])

    return element
}

function MobileMenuModal({ isActive, setIsActive, links }) {
    const location = useLocation()
    const elementRef = useOutsideClickRef(setIsActive)

    return (
        <>
            { isActive && <div className="mobile-menu-modal-overlay" /> }
            <div className={'mobile-menu-modal row' + (isActive ? ' active' : '')} ref={elementRef}>
                <div className="links-col col">
                    {
                        links.filter(link => link.isVisible).map(link => {
                            let linkProps = {}

                            if (link.path) {
                                linkProps = {
                                    ...linkProps,
                                    to: link.path
                                }
                            }

                            if (link.onClick) {
                                linkProps = {
                                    ...linkProps,
                                    onClick: link.onClick
                                }
                            }

                            return <li className={'mobile-link-button' + (location.pathname === link.path ? ' active' : '')}>
                                <span className="link-icon">{link.icon}</span>
                                <Link {...linkProps}>{link.name}</Link>
                            </li>
                        })
                    }
                </div>
                <div className="close-button-col col">
                    <span onClick={() => setIsActive(false)}>×</span>
                </div>
            </div>
        </>
    )
}

function HamburgerMenu({ isActive, toggleMenu }) {
    return (
        <svg className="mobile-menu-toggle" viewBox="0 0 100 100" width="35px" fill="#fff" onClick={toggleMenu}>
            <path id={'menu-path-1'} className={isActive ? 'active' : ''} d="M20,25 l60,0 0,10 -60,0" />
            <path id={'menu-path-2'} className={isActive ? 'active' : ''} d="M20,45 l60,0 0,10 -60,0"/>
            <path id={'menu-path-3'} className={isActive ? 'active' : ''} d="M20,65 l60,0 0,10 -60,0"/>
        </svg>
    )
}

function UserDropDown({ username }) {
    const [isActive, setIsActive] = useState(false)

    const elementRef = useOutsideClickRef(setIsActive)

    const navigate = useStatefulNavigate()

    function toggleIsActive() {
        setIsActive(!isActive)
    }

    function handleLogout() {
        logoutUser()
        navigate(0)
    }

    return (
        <div ref={elementRef} className="user-dropdown noselect">
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

function NavBar({ user, isMobileView }) {
    const [isActive, setIsActive] = useState(false)
    const location = useLocation()
    const navigate = useStatefulNavigate()

    function handleLogout() {
        logoutUser()
        navigate(0)
    }

    function toggleMenu() {
        setIsActive(!isActive)
    }

    const links = [
        {
            name: 'Home',
            path: '/',
            icon: <HomeIcon />,
            isVisible: true
        },
        {
            name: 'Collection',
            path: '/collection',
            icon: <CollectionIcon />,
            isVisible: Boolean(user)
        }
    ]

    const mobileOnlyLinks = [
        {
            name: 'Settings',
            path: '/user/account-settings',
            icon: <GearIcon />,
            isVisible: Boolean(user)
        },
        {
            name: 'Logout',
            onClick: handleLogout,
            icon: <LogoutIcon />,
            isVisible: Boolean(user)
        },
        {
            name: 'Login',
            path: '/login',
            icon: <LoginIcon />,
            isVisible: !Boolean(user)
        }
    ]

    if (isMobileView) {
        return (
            <>
                <HamburgerMenu toggleMenu={toggleMenu} isActive={isActive} />
                <MobileMenuModal isActive={isActive} setIsActive={setIsActive} links={[...links, ...mobileOnlyLinks]} />
            </>
        )
    }

    return (
        <>
            <div className="nav-bar row">
                {
                    links
                        .filter(link => link.isVisible)
                        .map(link => (
                            <LinkButton
                                to={link.path}
                                className={'nav-link' + (location.pathname === link.path ? ' active' : '')}
                            >
                                {link.name}
                            </LinkButton>
                        ))
                }
            </div>
            { user
                ? <UserDropDown username={user.username} />
                : <LinkButton className="login-button" to="/login">Login</LinkButton>
            }
        </>
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
                    <NavBar user={user} isMobileView={TABLET_VIEW >= windowWidth} />
                </div>
            </div>
        </>
    )
}



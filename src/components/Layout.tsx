import React, { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'

import Header from './Header.tsx'
import NotificationsContainer from './Notification.tsx'
import { getCookie } from '../utils/cookies.ts'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/layout.scss'

function Layout({ children }) {
    const navigate = useStatefulNavigate()
    const location = useLocation()

    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    const isLoggedIn = getCookie('x-token') && user.username && user.email

    useEffect(() => {
        if(isLoggedIn && ['/login', '/register'].includes(location.pathname)) {
            const { from } = ['/login', '/register'].includes(location.state?.from) ? { from: '/' } : location.state || { from: '/' }
            navigate(from, true)
        }
    }, [])
    return (
        <div>
            <div id="backdrops">
                <div id="header-backdrop" />
                <div id="page-content-backdrop" />
            </div>
            <Header />
            <div className="container">
                <div className="page-content">
                    <NotificationsContainer />
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout

import _ from 'lodash'
import React, { useEffect } from 'react'
import {useLocation} from 'react-router-dom'

import Header from './Header.tsx'
import NotificationsContainer from './Notification.tsx'
import { getCookie } from '../utils/cookies.ts'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/layout.scss'
import { refreshKeywordsDictionary, refreshPiratesCsgList, refreshUser, refreshUserCollection } from '../services/globalState.ts'

function Layout({ children }) {
    const navigate = useStatefulNavigate()
    const location = useLocation()

    useEffect(() => {
        refreshPiratesCsgList()
        refreshKeywordsDictionary()
        refreshUser()
        refreshUserCollection()

        const invalidUserPaths = ['/login', '/register']
        const protectedPaths = ['/collection']

        if(getCookie('x-token') && invalidUserPaths.includes(location.pathname)) {
            const { from } = invalidUserPaths.includes(location.state?.from) ? { from: '/' } : location.state || { from: '/' }
            navigate(from, true)
        } else if(!getCookie('x-token') && protectedPaths.includes(location.pathname)) {
            const { from } = protectedPaths.includes(location.state?.from) ? { from: '/login' } : location.state || { from: '/login' }
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

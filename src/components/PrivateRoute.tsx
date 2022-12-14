import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { getCookie } from '../utils/cookies.ts'

function PrivateRoute() {
    const location = useLocation()

    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    const isLoggedIn = getCookie('x-token') && user.username && user.email

    return isLoggedIn
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoute


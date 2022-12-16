import React, {useEffect} from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { getCookie } from '../utils/cookies.ts'
import { useStatefulNavigate } from '../utils/hooks.ts'

function PrivateRoute() {
    const location = useLocation()
    const navigate = useStatefulNavigate()

    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    const isLoggedIn = getCookie('x-token') && user.username && user.email

    useEffect(() => {
        if(!isLoggedIn)
            navigate('/login', true)
    }, [])

    return isLoggedIn
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoute


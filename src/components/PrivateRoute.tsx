import React, {useEffect} from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {getUser, getUserCollection} from '../api'

import { useStatefulNavigate } from '../utils/hooks.ts'
import { isLoggedIn } from '../utils/user.ts'

function PrivateRoute() {
    const location = useLocation()
    const navigate = useStatefulNavigate()

    useEffect(() => {
        async function fetchUser() {
            await Promise.all([getUserCollection(), getUser()])
        }

        if(isLoggedIn()) {
            fetchUser()
        } else {
            navigate('/login', true)
        }
    }, [])

    return isLoggedIn
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoute


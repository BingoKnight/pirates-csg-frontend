import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { isLoggedIn } from '../utils/user.ts'

function PrivateRoute() {
    const location = useLocation()

    return isLoggedIn()
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoute


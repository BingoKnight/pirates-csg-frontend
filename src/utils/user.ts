import { getCookie } from './cookies.ts'

export function isLoggedIn() {
    return Boolean(getCookie('x-token'))
}


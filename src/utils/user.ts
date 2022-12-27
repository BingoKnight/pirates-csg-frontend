import { getCookie } from './cookies.ts'

export function isLoggedIn() {
    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    return Boolean(getCookie('x-token') && user.username && user.email)
}


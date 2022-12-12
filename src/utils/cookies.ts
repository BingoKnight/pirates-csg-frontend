export function getAllCookies() {
    return document.cookie.split(';').reduce((acc, cookieStr) => {
        const keyValueDividerIndex = cookieStr.indexOf('=')
        const key = cookieStr.slice(0, keyValueDividerIndex)
        const value = cookieStr.slice(keyValueDividerIndex + 1)
        return {...acc, [key]: value}
    }, {})
}

export function getCookie(cookieName: string): string | undefined {
    return document.cookie.split(';').find(cookie => {
        return cookie.trim().startsWith(cookieName + '=')
    })?.split('=')[1]
}

export function deleteCookie(cookieName: string) {
    if (getCookie(cookieName)) {
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}


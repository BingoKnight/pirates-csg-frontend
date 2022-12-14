import 'cross-fetch/polyfill'
import { deleteCookie, getCookie } from './utils/cookies.ts'

function authPostOptions(token) {
    return {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}

function authGetOptions(token) {
    return {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
}

export async function getPiratesCsgList() {
    const sessionPiratesList = sessionStorage.getItem('piratesCsgList')
    if (sessionPiratesList)
        return JSON.parse(sessionPiratesList)

    const piratesList = await fetch(
        `${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/pirates-csg`
    ).then(res => res.json())
    sessionStorage.setItem('piratesCsgList', JSON.stringify(piratesList.models))
    return piratesList.models
}

export async function getKeywordsDictionary() {
    const sessionKeywordsDictionary = sessionStorage.getItem('keywordsDictionary')
    if (sessionKeywordsDictionary)
        return JSON.parse(sessionKeywordsDictionary)

    const keywordsDictionary = await fetch(
        `${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/ability-keyword`
    ).then(res => res.json())
    sessionStorage.setItem('keywordsDictionary', JSON.stringify(keywordsDictionary.keywords))
    return keywordsDictionary.keywords
}

export async function registerUser(userCreds) {
    const options = {
        ...authPostOptions(getCookie('x-token')),
        body: JSON.stringify(userCreds)
    }

    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/register`, options)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function loginUser(userCreds) {
    const options = {
        ...authPostOptions(getCookie('x-token')),
        body: JSON.stringify(userCreds)
    }

    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/login`, options)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function logoutUser() {
    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/logout`, authPostOptions(getCookie('x-token')))
        .catch(console.log)
        .finally(() => {
            sessionStorage.removeItem('user')
            deleteCookie('x-token')
        })
}

export async function getUser() {
    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user`, authGetOptions(getCookie('x-token')))
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function updateEmail(email) {
    const options = {
        ...authPostOptions(getCookie('x-token')),
        body: JSON.stringify({ email })
    }

    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/change-email`, options)
        .then(async res => {
            const user = JSON.parse(sessionStorage.getItem('user'))
            sessionStorage.setItem('user', JSON.stringify({ ...user, email }))
            return res
        })
}


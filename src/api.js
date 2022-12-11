import 'cross-fetch/polyfill'
import { deleteCookie } from './utils/cookies.ts'

const defaultPostOptions = process.env.NODE_ENV === 'development' ? { credentials: 'include' } : {}

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
        ...defaultPostOptions,
        method: 'POST',
        body: JSON.stringify(userCreds),
        headers: {'Content-Type': 'application/json'}
    }
    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/register`, options)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function loginUser(userCreds) {
    const options = {
        ...defaultPostOptions,
        method: 'POST',
        body: JSON.stringify(userCreds),
        headers: {'Content-Type': 'application/json'}
    }
    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/login`, options)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function logoutUser(token) {
    const options = {
        ...defaultPostOptions,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/login`, options)
        .then(() => {
            sessionStorage.removeItem('user')
            deleteCookie('x-token')
        })
        .catch(err => {
            console.log(err)
        })
}

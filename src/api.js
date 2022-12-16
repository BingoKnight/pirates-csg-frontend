import 'cross-fetch/polyfill'

import {pushNotification} from './services/notificationService.ts'
import { deleteCookie, getCookie } from './utils/cookies.ts'
import { capitalize } from './utils/string.tsx'

async function jsonOrContent(res) {
    const text = await res.text()
    try {
        return JSON.parse(text)
    } catch(err) {
        return text
    }
}

function standardizeError(err) {
    if(!err.body) {
        return ['Unexpected error occurred']
    }

    let errorBody = []
    if(err.body.details?.body) {
        errorBody = err.body.details?.body.map(error => error.message)
    } else if(err.body.error) {
        errorBody = [err.body.error]
    } else {
        errorBody = [err.body]
    }

    console.log(errorBody)
    return errorBody.map(error => capitalize(error.replaceAll('"', '').replaceAll('\'', '')))
}

class WebError extends Error {
    constructor(body, status) {
        super(`${status} error`)
        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.body = body
        this.status = status
    }
}

function clearLocalUser() {
    sessionStorage.removeItem('user')
    deleteCookie('x-token')
}

function handleResponseError(err) {
    if(err.name === 'WebError') {
        if(err.status === 401) {
            clearLocalUser()
        }

        let errorBody = []
        try {  // handle error raised by err.body including non-string value
            errorBody = standardizeError(err)
        } catch(e) {
            console.log(e)
            pushNotification({type: 'error', message: 'Unexpected error occurred'})
        }

        console.log(errorBody)
        errorBody.forEach(message => pushNotification({type: 'error', message}))
    } else {
        console.log(err)
        pushNotification({type: 'error', message: 'Unexpected error occurred'})
    }
    throw err
}

async function get(path, headers = {}) {
    const token = getCookie('x-token')
    const tokenHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}

    const options = {
        method: 'GET',
        headers: {
            ...tokenHeaders,
            ...headers
        }
    }
    return fetch(process.env.REACT_APP_PIRATE_CSG_API_BASE_URL + path, options)
        .then(async res => {
            if(!res.ok) {
                throw new WebError(await jsonOrContent(res), res.status)
            }
            return res
        })
        .catch(handleResponseError)
}

async function post(path, payload = {}, headers = {}) {
    const token = getCookie('x-token')
    const tokenHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}

    const options = {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...tokenHeaders,
            ...headers
        },
        body: typeof payload === 'string' ? payload : JSON.stringify(payload)
    }

    return fetch(process.env.REACT_APP_PIRATE_CSG_API_BASE_URL + path, options)
        .then(async res => {
            if(!res.ok) {
                throw new WebError(await jsonOrContent(res), res.status)
            }
            return res
        })
        .catch(handleResponseError)
}

export async function getPiratesCsgList() {
    const sessionPiratesList = sessionStorage.getItem('piratesCsgList')
    if (sessionPiratesList)
        return JSON.parse(sessionPiratesList)

    return get('/v1/pirates-csg')
        .then(res => res.json())
        .then(json => {
            sessionStorage.setItem('piratesCsgList', JSON.stringify(json.models))
            return json.models
        })
}

export async function getKeywordsDictionary() {
    const sessionKeywordsDictionary = sessionStorage.getItem('keywordsDictionary')
    if (sessionKeywordsDictionary)
        return JSON.parse(sessionKeywordsDictionary)

    return get('/v1/ability-keyword')
        .then(res => res.json())
        .then(json => {
            const keywords = json.keywords
            sessionStorage.setItem('keywordsDictionary', JSON.stringify(keywords))
            return keywords
        })
}

export async function registerUser(userCreds) {
    return post('/v1/user/register', userCreds)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function loginUser(userCreds) {
    return post('/v1/user/login', userCreds)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function logoutUser() {
    return post('/v1/user/logout')
        .finally(clearLocalUser)
}

export async function getUser() {
    return get('/v1/user')
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function updateEmail(email) {
    return post('/v1/user/change-email', { email })
        .then(async res => {
            const user = JSON.parse(sessionStorage.getItem('user'))
            sessionStorage.setItem('user', JSON.stringify({ ...user, email }))
            pushNotification({ type: 'success', message: 'Email updated!' })
            return res
        })
}

export async function updatePassword(currentPassword, newPassword) {
    const payload = {
        password: currentPassword,
        newPassword
    }

    return post('/v1/user/change-password', payload)
        .then(async res => {
            pushNotification({ type: 'success', message: 'Password updated!' })
            return res
        })
}


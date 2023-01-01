import 'cross-fetch/polyfill'
import _ from 'lodash'

import {pushNotification} from './services/notificationService.ts'
import { deleteCookie, getCookie } from './utils/cookies.ts'

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
    return errorBody.map(error => _.capitalize(error.replaceAll('"', '').replaceAll('\'', '')))
}

class WebError extends Error {
    constructor(body, status) {
        super(`${status} error`)
        Error.captureStackTrace(this, this.constructor)

        this.name = 'WebError'
        this.body = body
        this.status = status
    }
}

function clearLocalUser() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('userCollection')
    deleteCookie('x-token')
}

function handleResponseError(err) {
    console.log(err)
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
        pushNotification({type: 'error', message: 'Unexpected error occurred'})
    }
    throw err
}

async function _get(path, headers = {}) {
    const token = getCookie('x-token')
    const tokenHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}

    const options = {
        credentials: 'include',
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
}

async function _post(path, payload = {}, headers = {}) {
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

async function _put(path, payload = {}, headers = {}) {
    const token = getCookie('x-token')
    const tokenHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}

    const options = {
        credentials: 'include',
        method: 'PUT',
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

async function _delete(path, params = {}, headers = {}) {
    const token = getCookie('x-token')
    const tokenHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}

    const urlParams = '?' + Object.entries(params).map(([key, value]) => {
        console.log(key)
        console.log(value)
        console.log(Array.isArray(value))
        if (Array.isArray(value)) {
            return value.map(v => {console.log(v); return`${encodeURIComponent(key)}=${encodeURIComponent(v)}`}).join('&')
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    }).join('&')

    const options = {
        credentials: 'include',
        method: 'DELETE',
        headers: {
            ...tokenHeaders,
            ...headers
        }
    }

    return fetch(process.env.REACT_APP_PIRATE_CSG_API_BASE_URL + path + urlParams, options)
        .then(async res => {
            if(!res.ok) {
                throw new WebError(await jsonOrContent(res), res.status)
            }
            return res
        })
}

export async function getPiratesCsgList() {
    const sessionPiratesList = sessionStorage.getItem('piratesCsgList')
    if (sessionPiratesList)
        return JSON.parse(sessionPiratesList)

    return _get('/v1/pirates-csg')
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

    return _get('/v1/ability-keyword')
        .then(res => res.json())
        .then(json => {
            const keywords = json.keywords
            sessionStorage.setItem('keywordsDictionary', JSON.stringify(keywords))
            return keywords
        })
}

export async function registerUser(userCreds) {
    return _post('/v1/user/register', userCreds)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function loginUser(userCreds) {
    return _post('/v1/user/login', userCreds)
        .then(async res => {
            sessionStorage.setItem('user', JSON.stringify(await res.clone().json()))
            return res
        })
}

export async function logoutUser() {
    return _post('/v1/user/logout')
        .finally(clearLocalUser)
}

export async function getUser() {
    const sessionUser = sessionStorage.getItem('user')
    if (getCookie('x-token') && sessionUser)
        return JSON.parse(sessionUser)

    return _get('/v1/user')
        .then(res => res.json())
        .then(json => {
            sessionStorage.setItem('user', JSON.stringify(json))
            return json
        })
        .catch(() => {
            clearLocalUser()
            return
        })
}

export async function updateEmail(email) {
    return _post('/v1/user/change-email', { email })
        .then(async res => {
            const user = await getUser()
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

    return _post('/v1/user/change-password', payload)
        .then(async res => {
            pushNotification({ type: 'success', message: 'Password updated!' })
            return res
        })
}

export async function getUserCollection() {
    const sessionUserCollection = sessionStorage.getItem('userCollection')
    if (sessionUserCollection)
        return JSON.parse(sessionUserCollection)

    return _get('/v1/collection')
        .then(res => res.json())
        .then(json => {
            const userCollection = json.collection.map(obj => ({
                ...obj.item,
                count: obj.count
            }))
            sessionStorage.setItem('userCollection', JSON.stringify(userCollection))
            return userCollection
        })
        .catch(handleResponseError)
}

export async function addToCollection(itemIds) {
    const payload = {
        collection: itemIds.map(itemId => ({ itemId }))
    }

    return _put('/v1/collection/update', payload)
        .then(res => res.json())
        .then(json => {
            const userCollection = json.collection.map(obj => ({
                ...obj.item,
                count: obj.count
            }))
            sessionStorage.setItem('userCollection', JSON.stringify(userCollection))
            return userCollection
        })
}

export async function removeFromCollection(itemIds) {
    console.log({ id: itemIds })
    return _delete('/v1/collection/remove', { id: itemIds })
        .then(res => res.json())
        .then(json => {
            const userCollection = json.collection.map(obj => ({
                ...obj.item,
                count: obj.count
            }))
            sessionStorage.setItem('userCollection', JSON.stringify(userCollection))
            return userCollection
        })
}


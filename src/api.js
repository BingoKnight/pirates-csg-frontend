import 'cross-fetch/polyfill'

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
        method: 'POST',
        body: JSON.stringify(userCreds),
        headers: {'Content-Type': 'application/json'}
    }
    return await fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/register`, options)
}

export async function loginUser(userCreds) {
    const options = {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(userCreds),
        headers: {'Content-Type': 'application/json'}
    }
    return await fetch(`${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/v1/user/login`, options)
}


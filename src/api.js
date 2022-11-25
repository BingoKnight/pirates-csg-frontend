export async function getPirateCsgList() {
    const sessionPiratesList = sessionStorage.getItem('pirateCsgList')
    if (sessionPiratesList)
        return JSON.parse(sessionPiratesList)

    const piratesList = await fetch(
        `${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/pirates-csg`
    ).then(res => res.json())
    sessionStorage.setItem('pirateCsgList', JSON.stringify(piratesList.models))
    return piratesList.models
}

export async function getKeywordsDictionary() {
    const sessionKeywordsDictionary = sessionStorage.getItem('keywordsDictionary')
    if (sessionKeywordsDictionary)
        return JSON.parse(sessionKeywordsDictionary)

    const keywordsDictionary = await fetch(
        `${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/ability-keyword`
    ).then(res => res.json())
    sessionStorage.setItem('keywordsDictionary', JSON.stringify(keywordsDictionary.keywords))
    return keywordsDictionary.keywords
}


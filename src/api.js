export async function getPirateCsgList() {
    if (sessionStorage.getItem('pirateCsgList'))
        return JSON.parse(sessionStorage.getItem('pirateCsgList'))

    const piratesList = await fetch(
        `${process.env.REACT_APP_PIRATE_CSG_API_BASE_URL}/pirates-csg`
    ).then(res => res.json())
    sessionStorage.setItem('pirateCsgList', JSON.stringify(piratesList.models))
    return piratesList.models
}

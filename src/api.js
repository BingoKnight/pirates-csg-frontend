export async function getPirateCsgList() {
    if (sessionStorage.getItem('pirateCsgList'))
        return JSON.parse(sessionStorage.getItem('pirateCsgList'))

    const piratesList = await fetch('http://localhost:8080/pirates-csg').then(res => res.json())
    sessionStorage.setItem('pirateCsgList', JSON.stringify(piratesList.models))
    return piratesList.models
}

import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import MainModal from './MainModal.tsx'
import MobileModal from './MobileModal.tsx'

import { getPiratesCsgList, getKeywordsDictionary } from '../../api.js'
import { TABLET_VIEW } from '../../constants.js'
import { useStatefulNavigate } from '../../utils/hooks.ts'


function CsgModal() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useStatefulNavigate()

    const sessionStoragePiratesList = JSON.parse(sessionStorage.getItem('piratesCsgList'))
    const sessionStorageKeywordsDictionary = JSON.parse(sessionStorage.getItem('keywordsDictionary'))

    const [ piratesCsgList, setPiratesCsgList ] = useState(sessionStoragePiratesList || [])
    const [ apiFetchComplete, setApiFetchComplete ] = useState<Boolean>(sessionStoragePiratesList && sessionStorageKeywordsDictionary)

    const csgItem = piratesCsgList.filter(csgItem => csgItem._id === id)[0]

    console.log(location)
    const { from } = location.state || { from: '/' }
    console.log(from)
    const closeModal = () => navigate(from, true)

    useEffect(() => {
        async function fetchData() {
            setPiratesCsgList(await getPiratesCsgList())
            await getKeywordsDictionary()
            setApiFetchComplete(true)
        }

        if (!(piratesCsgList && piratesCsgList.length > 0)) {
            fetchData()
        }
    }, [])

    if (!apiFetchComplete) {
        return
    }

    if (!csgItem)
        return <Navigate to='/' replace />

    if (window.innerWidth <= TABLET_VIEW) {
        return <MobileModal csgItem={csgItem} closeModal={closeModal} />
    }
    return <MainModal csgItem={csgItem} closeModal={closeModal} />
}

export default CsgModal


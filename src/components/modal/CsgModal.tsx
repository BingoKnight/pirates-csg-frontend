import React from 'react'
import { useSearchParams } from 'react-router-dom'

import MainModal from './MainModal.tsx'
import MobileModal from './MobileModal.tsx'

import {TABLET_VIEW} from '../../constants'


function CsgModal({ csgItem, closeModal, windowWidth }) {
    const [ searchParams, setSearchParams ] = useSearchParams()

    function closeModalHandler() {
        closeModal()

        if (searchParams.has('_id')) {
            searchParams.delete('_id')
            setSearchParams(searchParams)
        }
    }

    const modalProps = {
        csgItem,
        closeModalHandler
    }

    if (!csgItem)
        return null

    if (windowWidth <= TABLET_VIEW) {
        return (
            <MobileModal {...modalProps} />
        )
    }

    return <MainModal {...modalProps} />
}

export default CsgModal


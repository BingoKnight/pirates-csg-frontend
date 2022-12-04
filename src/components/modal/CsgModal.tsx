import React from 'react'
import { useSearchParams } from 'react-router-dom'

import MainModal from './MainModal.tsx'

function CsgModal({ csgItem, closeModal }) {
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

    return <MainModal {...modalProps} />
}

export default CsgModal


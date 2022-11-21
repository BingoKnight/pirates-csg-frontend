import React from 'react'
import { ReactComponent as XIcon } from '../images/times.svg'

import '../styles/csgModal.scss'

function ModalOverlay({ closeModal }) {
    return <>
        <div className='fixed-overlay' onClick={closeModal}>
        </div>
    </>
}

function CsgModal({ csgItem, closeModal }) {
    if (!csgItem)
        return null

    const csgItemImageUrl = csgItem.image.replace(
        '/home/nathan/Projects/pirates-csg-api/public',
        'http://localhost:8080'
    )

    return (
        <>
            <ModalOverlay closeModal={closeModal} />
            <div className="csg-modal">
                <div className="row">
                    <div className="col">
                        <XIcon />
                    </div>
                </div>
                <div className="row modal-content">
                    <div className="col">
                        <img src={csgItemImageUrl} id="csg-item-image" alt={csgItem.name} />
                    </div>
                    <div className="col">
                        {csgItem.name}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CsgModal


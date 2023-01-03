import { useObservableState } from 'observable-hooks'
import React, { useState } from 'react'

import { addToCollection, removeFromCollection } from '../../api.js'
import { ReactComponent as Copy } from '../../images/copy-regular.svg'
import { ReactComponent as Plus } from '../../images/plus-solid.svg'
import { ReactComponent as Trash } from '../../images/trash-solid.svg'
import { ReactComponent as VerticalEllipsis } from '../../images/ellipsis-vertical-solid.svg'
import { pushNotification } from '../../services/notificationService.ts'
import { user$ } from '../../services/globalState.ts'
import { NotificationType } from '../../types/notification.ts'
import { useOutsideClickRef } from '../../utils/hooks.ts'

import '../../styles/modalBase.scss'

function ModalOptionsMenu({ csgItem, isInCollection, closeMenu }) {
    const user = useObservableState(user$, {})
    const [isUpdatingCollection, setIsUpdatingCollection] = useState(false)
    const elementRef = useOutsideClickRef(closeMenu)

    const iconProps = {
        height: '15px'
    }

    function handleCopyClick() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_PIRATE_CSG_FE_BASE_URL}/details/${csgItem._id}`)
        pushNotification({
            type: NotificationType.success,
            message: `Copied ${csgItem.name}`
        })
    }

    function handleAddToCollectionClick() {
        if (!isUpdatingCollection) {
            setIsUpdatingCollection(true)
            addToCollection([csgItem._id])
                .then(() => {
                    setIsUpdatingCollection(false)
                    pushNotification({
                        type: NotificationType.success,
                        message: `Added ${csgItem.name}`
                    })
                })
        }
    }

    function handleRemoveFromCollectionClick() {
        if (!isUpdatingCollection) {
            setIsUpdatingCollection(true)
            removeFromCollection([csgItem._id])
                .then(() => {
                    setIsUpdatingCollection(false)
                    pushNotification({
                        type: NotificationType.success,
                        message: `Removed ${csgItem.name}`
                    })
                })
        }
    }

    const links = [
        {
            name: 'Copy',
            onClick: handleCopyClick,
            icon: <Copy {...iconProps} />,
            isVisible: true
        },
        {
            name: 'Add to Collection',
            onClick: handleAddToCollectionClick,
            icon: <Plus {...iconProps} />,
            isVisible: Boolean(user) && !isInCollection
        },
        {
            name: 'Remove from Collection',
            onClick: handleRemoveFromCollectionClick,
            icon: <Trash {...iconProps} />,
            isVisible: Boolean(user) && isInCollection
        }
    ]

    return (
        <div ref={elementRef} className="modal-options-menu">
            <div className="modal-options-menu-content">
                {
                    links.filter(link => link.isVisible).map(link => {
                        return <li className="menu-button" onClick={link.onClick}>
                            <span className="link-icon">{link.icon}</span>
                            <span className="link-text">{link.name}</span>
                        </li>
                    })
                }
            </div>
        </div>
    )
}

export function ModalOptions({ csgItem, isInCollection }) {
    const [isActive, setIsActive] = useState(false)

    return (
        <>
            <div className="modal-options-button" onClick={() => setIsActive(!isActive)}>
                <VerticalEllipsis height={'25px'} />
            </div>
            {
                isActive
                && <ModalOptionsMenu
                    csgItem={csgItem}
                    isInCollection={isInCollection}
                    closeMenu={() => setIsActive(false)}
                />
            }
        </>
    )
}


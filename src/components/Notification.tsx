import React from 'react'
import { useObservableState } from 'observable-hooks'

import { ReactComponent as CircleCheck } from '../images/check-circle.svg'
import { ReactComponent as InfoCircle } from '../images/info-circle.svg'
import { ReactComponent as ExclamationCircle } from '../images/exclamation-circle.svg'
import { notifications$, popNotification, pushNotification } from '../services/notificationService.ts'
import { NotificationObject } from '../types/notification.ts'

import '../styles/notification.scss'

function NotificationItem({ id, type, message }) {
    const notificationTypeIconMapper = {
        error: <ExclamationCircle />,
        success: <CircleCheck />,
        info: <InfoCircle />
    }
    return (
        <div className={'row notification ' + type} onClick={() => popNotification(id)}>
            <div className="col icon">{notificationTypeIconMapper[type]}</div>
            <div className="col message">{message}</div>
        </div>
    )
}

function NotificationList() {
    const notifications = useObservableState<NotificationObject[]>(notifications$, [])

    return notifications.map(notification => {
        return (
            <NotificationItem {...notification} />
        )
    })
}

function NotificationsContainer() {
    return (
        <div className="notification-container">
            <NotificationList />
        </div>
    )
}

export default NotificationsContainer


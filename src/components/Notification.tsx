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

    //TODO: add timer that is a progress bar that gets smaller as notification ages towards removal
    //      should be able to achieve this with setting the timer width with a transformation
    //      towards a width of 0 over the course of 7 seconds
    return (
        <div className={'row notification ' + type} onClick={() => popNotification(id)}>
            <div className="col icon">{notificationTypeIconMapper[type]}</div>
            <div className="col message">{message}</div>
            <div className="timer"></div>
        </div>
    )
}

function NotificationList({ notifications }) {
    return notifications.map(notification => {
        return (
            <NotificationItem {...notification} />
        )
    })
}

function NotificationsContainer() {
    const notifications = useObservableState<NotificationObject[]>(notifications$, [])

    if (notifications.length === 0)
        return null

    return (
        <div className="notification-container">
            <NotificationList notifications={notifications} />
        </div>
    )
}

export default NotificationsContainer


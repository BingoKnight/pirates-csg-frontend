import { BehaviorSubject } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'

import { NotificationObject, PushNotification } from '../types/notification.ts'


export const notifications$ = new BehaviorSubject<NotificationObject[]>([])
const MAX_INDEX = 4

export function pushNotification(pushedNotification: PushNotification) {
    console.log(pushedNotification)
    const id = uuidv4()
    const notification = {
        id,
        timer: setTimeout(() => {
            notifications$.next(notifications$.value.filter(notification => notification.id !== id))
        }, 7000),
        ...pushedNotification
    }

    notifications$.value.slice(MAX_INDEX).forEach(n => clearTimeout(n.timer))

    notifications$.next([notification, ...notifications$.value.slice(0, MAX_INDEX)])
    
}

export function popNotification(id: string) {
    const notification = notifications$.value.find(notification => notification.id === id)
    clearTimeout(notification.timer)
    notifications$.next(notifications$.value.filter(notification => notification.id !== id))
}


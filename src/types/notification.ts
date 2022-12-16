export enum NotificationType {
    error = 'error',
    info = 'info',
    success = 'success'
}

export interface PushNotification {
    type: NotificationType
    message: string
}

export interface NotificationObject extends PushNotification {
    id: string,
    timer: ReturnType<typeof setTimeout>
}


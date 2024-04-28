export interface ISaveToken {
    userId: string;
    fcmToken: string;
}

export interface ISettings {
    userId: string;
    isNotificationOn: boolean;
}

export interface ISendNotification {
    // userId: string;
    notificationType: string;
    senderId: string;
    recipientsId: string[];
    title: string;
    message?: string;
    data?: object | string;
}

export interface IListNotifications {
    limit: number;
    offset: number;
    userId: string;
    notificationType?: string;
}

export interface INotificationQuery {
    userId: string;
    notificationId: string;
}

export interface IChangeStatus {
    userId: string;
    notificationId: string;
}


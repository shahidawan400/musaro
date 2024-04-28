import { IChangeStatus, IListNotifications, INotificationQuery, ISaveToken, ISendNotification, ISettings } from "./notification.interface";

export interface INotificationService {
    saveToken(payload: ISaveToken);
    settings(payload: ISettings);
    changeStatus(payload: IChangeStatus);
    sendNotification(payload: ISendNotification);
    listNotifications(payload: IListNotifications);
    getNotification(payload: INotificationQuery);
}
import INotificationRepositories from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/schemas/Notification';
import { ObjectId } from 'mongodb';


class NotificationsRepository implements INotificationRepositories {
  private notification: Notification[] = [];

  public async create({ content, recipient_id }:ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectId(), content, recipient_id });

    this.notification.push(notification);

    return notification;
  }
}

export default NotificationsRepository;

import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { INotificationRepository } from './interfaces';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationRepository
  extends AbstractRepository<Notification>
  implements INotificationRepository<Notification>
{
  protected readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectModel(Notification.name) professionModel: Model<Notification>,
    @InjectConnection() connection: Connection,
  ) {
    super(professionModel, connection);
  }

}

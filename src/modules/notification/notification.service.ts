import { Injectable } from '@nestjs/common';
import {
  IChangeStatus,
  IListNotifications,
  INotificationQuery,
  INotificationService,
  ISaveToken,
  ISendNotification,
  ISettings,
} from './interfaces';
import { NotificationRepository } from './notification.repository';
import { UserRepository } from '../user';
import { FirebaseNotificationService } from '@shared/services';
import mongoose from 'mongoose';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository,
    private firebaseNotificationService: FirebaseNotificationService,
  ) {}

  async saveToken(payload: ISaveToken) {
    try {
      const { userId, fcmToken } = payload;
      await this.userRepository.findOneAndUpdate(
        { _id: userId },
        {
          $set: { 'metadata.fcmToken': fcmToken },
        },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }
  async settings(payload: ISettings) {
    try {
      const { userId, isNotificationOn } = payload;
      await this.userRepository.findOneAndUpdate(
        { _id: userId },
        {
          $set: { 'metadata.isNotificationOn': isNotificationOn },
        },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }
  async changeStatus(payload: IChangeStatus) {
    try {
      const { notificationId, userId } = payload;

      const filterQuery = {
        _id: new mongoose.Types.ObjectId(notificationId),
        recipients: {
          $elemMatch: {
            id: new mongoose.Types.ObjectId(userId),
          },
        },
      };
      const updateOperation = {
        $set: {
          'recipients.$.isRead': true,
        },
      };

      await this.notificationRepository.findOneAndUpdate(
        filterQuery,
        updateOperation,
      );
      return null;
    } catch (error) {
      throw error;
    }
  }
  async sendNotification(payload: ISendNotification) {
    try {
      const { senderId, notificationType, recipientsId, title, message } =
        payload;
      const data = JSON.stringify(payload?.data);
      payload.data = data;

      const recipients = recipientsId?.map((id) => ({ id, isRead: false }));

      await this.notificationRepository.create({
        notificationType,
        senderId,
        recipients,
        message,
        title,
        data,
      });

      await this.pushNotification(payload);
      return null;
    } catch (error) {
      throw error;
    }
  }
  async listNotifications(payload: IListNotifications) {
    try {
      const { limit, offset, userId, notificationType } = payload;
      const match = {
        'recipients.id': userId,
      };
      if (notificationType) {
        match['notificationType'] = notificationType;
      }

      return await this.notificationRepository.paginate({
        pipelines: [
          {
            $unwind: {
              path: '$recipients',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              ...match,
            },
          },
          {
            $project: {
              notificationType: '$notificationType',
              senderId: '$senderId',
              recipient: {
                id: '$recipients.id',
                isRead: '$recipients.isRead',
              },
              message: '$message',
              data: '$data',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        ],
        limit,
        offset,
      });
    } catch (error) {
      throw error;
    }
  }
  async getNotification(payload: INotificationQuery) {
    try {
      const { notificationId, userId } = payload;

      // const response = await this.notificationRepository.findOne({
      //     _id: notificationId
      // }, {
      //     senderId: 0,
      //     recipients: {
      //         $elemMatch: { id: userId }
      //     }
      // });
      const response = await this.notificationRepository.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(notificationId),
          },
        },
        {
          $unwind: {
            path: '$recipients',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'recipients.id': new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            notificationType: '$notificationType',
            senderId: '$senderId',
            recipient: {
              id: '$recipients.id',
              isRead: '$recipients.isRead',
            },
            message: '$message',
            data: '$data',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
          },
        },
      ]);

      return { data: response.length > 0 ? response[0] : {} };
    } catch (error) {
      throw error;
    }
  }
  private async pushNotification(payload: ISendNotification) {
    try {
      const { recipientsId, message, title, data } = payload;
      if (recipientsId?.length === 0) {
        return null;
      }
      
      const users = await this.userRepository.find(
        {
          _id: { $in: recipientsId },
          'metadata.isNotificationOn': true,
        },
        {
          _id: 0,
          'metadata.fcmToken': 1,
        },
      );

      if (users?.length === 0) {
        return null;
      }
      const fcmTokens = users?.map((user) => user?.metadata?.fcmToken);
      const singleToken = fcmTokens.length === 1;

      const notificationPayload: any = {
        notification: {
          title,
          body: message,
        },
        data: {
          payload: data,
        },
      };

      singleToken
        ? (notificationPayload['token'] = fcmTokens[0])
        : (notificationPayload['tokens'] = fcmTokens);

      await this.firebaseNotificationService[
        singleToken ? 'sendSinglecast' : 'sendMulticast'
      ](notificationPayload);
      return null;
    } catch (error) {
      throw error;
    }
  }
}

import { BadRequestException, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';

export class FirebaseNotificationService {
  protected readonly logger = new Logger(FirebaseNotificationService.name);
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendSinglecast(payload: messaging.Message) {
    try {
      const response = await this.firebaseAdmin.messaging().send(payload);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async sendMulticast(payload: messaging.MulticastMessage) {
    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
      if (response?.failureCount > 0) {
        throw new BadRequestException(response?.responses);
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseNotificationService, S3Service } from './services';
import * as admin from 'firebase-admin';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'S3',
      useFactory: (config: ConfigService) =>
        new S3({
          region: config.get('S3_REGION'),
          credentials: {
            accessKeyId: config.get('S3_AWS_ACCESS_KEY'),
            secretAccessKey: config.get('S3_AWS_SECRET_KEY'),
          },
        }),
      inject: [ConfigService],
    },
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (config: ConfigService) => {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: `${config.get('PROJECT_ID')}`,
            clientEmail: `${config.get('CLIENT_EMAIL')}`,
            privateKey: `${config.get('PRIVATE_KEY')?.replace(/\\n/g, '\n')}`,
          }),
        });
        return admin;
      },
      inject: [ConfigService],
    },
    S3Service,
    FirebaseNotificationService,
  ],
  exports: [S3Service, FirebaseNotificationService],
})
export class SharedModule { }

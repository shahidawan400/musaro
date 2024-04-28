import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ExceptionsFilter } from './filters';
import { ResponseInterceptor } from './interceptors';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';
import { GeneralModule } from './modules/general/general.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { NotificationModule } from './modules/notification/notification.module';
import { JobModule } from './modules/job/job.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { ActivityLogModule } from './modules/activity-log';
import { ReviewModule } from './modules/review/review.module';
import { WorkshopModule } from './modules/workshop/workshop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      // envFilePath: `.${process.env.APP_ENV || 'development'}.env`,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: `${config.get('MONGO_DSN')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PaymentModule,
    GeneralModule,
    SubscriptionModule,
    NotificationModule,
    JobModule,
    ActivityLogModule,
    FavouriteModule,
    ReviewModule,
    WorkshopModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}

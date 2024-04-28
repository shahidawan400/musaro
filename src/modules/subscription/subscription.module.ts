import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionController } from './controllers/subscription.controller';
import { UserModule } from '../user';
import { SubscriptionPlanService, SubscriptionService } from './services';
import { SubscriptionPlanController } from './controllers/subscription-plan.controller';
import {
  SubscriptionPlanRepository,
  SubscriptionRepository,
} from './repositories';
import { PaymentModule } from '../payment';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionPlanSchema,
  SubscriptionSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    SharedModule,
    UserModule,
    PaymentModule,
    // forwardRef(PaymentModule),
  ],
  controllers: [SubscriptionController, SubscriptionPlanController],
  providers: [
    SubscriptionService,
    SubscriptionPlanService,
    SubscriptionRepository,
    SubscriptionPlanRepository,
  ],
  exports: [
    SubscriptionRepository,
    SubscriptionPlanRepository,
    SubscriptionService,
    SubscriptionPlanService,
  ],
})
export class SubscriptionModule {}

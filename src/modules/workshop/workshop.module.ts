import { Module } from '@nestjs/common';
import { WorkshopService } from './services/workshop.service';
import { WorkshopController } from './controllers/workshop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workshop, WorkshopSchema } from './schemas';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from '../user';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WorkshopRepository } from './repositories';
import { PaymentModule } from '../payment';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workshop.name, schema: WorkshopSchema },
    ]),
    SharedModule,
    UserModule,
    PaymentModule,
    SubscriptionModule,
  ],
  controllers: [WorkshopController],
  providers: [WorkshopService, WorkshopRepository],
})
export class WorkshopModule {}

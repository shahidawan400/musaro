import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ISubscriptionPlanRepository } from '../interfaces';
import { SubscriptionPlan } from '../schemas';

@Injectable()
export class SubscriptionPlanRepository
  extends AbstractRepository<SubscriptionPlan>
  implements ISubscriptionPlanRepository<SubscriptionPlan>
{
  protected readonly logger = new Logger(SubscriptionPlanRepository.name);

  constructor(
    @InjectModel(SubscriptionPlan.name)
    subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscriptionPlanModel, connection);
  }
}

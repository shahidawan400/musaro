import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { SubscriptionPlanType, SubscriptionType } from '@shared/constants';

@Schema({
  collection: 'subscription-plans',
  versionKey: false,
  timestamps: true,
})
export class SubscriptionPlan extends AbstractSchema<string> {
  @Prop({ type: String, required: true, enum: SubscriptionPlanType })
  type: string;

  @Prop({ type: String, required: true, enum: SubscriptionType })
  plan: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, required: false, default: 0 })
  discount?: number;

  @Prop({ type: Array<String>, required: true })
  features: string[];

  @Prop({ type: Boolean, required: false, default: true })
  isActive?: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

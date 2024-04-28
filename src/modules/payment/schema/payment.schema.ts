import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { PaymentOption, PaymentStatus, PaymentType } from '@shared/constants';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'payments',
  versionKey: false,
  timestamps: true,
})
export class Payment extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  userId: string; // User ID who initiated the payment

  @Prop({ type: Number, required: true })
  amount: number; // Amount of payment

  @Prop({ type: String, required: true, enum: PaymentOption })
  paymentOption: string; // Payment option (e.g., mada, visa, paypal, apple pay)

  @Prop({ type: String, required: true, enum: PaymentType })
  paymentType: string; // Type of payment (e.g., subscription, workshop_fee, workshop_ticket)

  @Prop({
    type: String,
    required: false,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus?: string; // Payment status (e.g., pending, success, failed)

  @Prop({ type: String, required: true })
  transactionId: string; // Transaction ID provided by Moyasar

  @Prop({ type: String, required: false })
  description?: string; // Description of the payment

  @Prop({ type: Date, required: true })
  paymentDate: Date; // Date and time of the payment

  // @Prop({ type: Object, required: false })
  // metadata?: any; // Additional metadata related to the payment
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

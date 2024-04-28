import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { NotificationType, PaymentOption, PaymentStatus, PaymentType } from '@shared/constants';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'notifications',
  versionKey: false,
  timestamps: true
})
export class Notification extends AbstractSchema<string> {

  @Prop({ type: String, required: true, enum: NotificationType })
  notificationType: string; // Type of Notification (e.g., reuqest)

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  senderId: string; // User ID who initiated the Notification

  @Prop({
    type: [{
      id: { type: SchemaTypes.ObjectId, ref: 'users', required: true },
      isRead: { type: Boolean, default: false }
    }],
    required: true
  })
  recipients: {
    id: string,
    isRead: boolean
  }[];   // Array of user IDs and its read status who will recieve Notification

  @Prop({ type: String, required: true })
  title: string; // Title of the notification

  @Prop({ type: String, required: false })
  message?: string; // Message of the notification

  @Prop({ type: String, required: false })
  data?: string; // Notification Data in Stringyfy Form
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

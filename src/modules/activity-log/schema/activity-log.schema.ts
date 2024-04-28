import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { ActivityLogType } from '@shared/constants';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'activity-logs',
  versionKey: false,
  timestamps: true,
})
export class ActivityLog extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  createdBy: string; // User ID who initiated the Log

  @Prop({ type: SchemaTypes.ObjectId, ref: 'users' })
  userId?: string; // User ID whose saved log was created

  @Prop({ type: String, required: true, enum: Object.values(ActivityLogType) })
  logType: ActivityLogType; // Type of Activity Log

  @Prop({ default: Date.now })
  timestamp?: Date; // Timestamp of the log

  @Prop({ type: Object, default: {} })
  details?: Record<string, any>; // Extra data for the logs
}
export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

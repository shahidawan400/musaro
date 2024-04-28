import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { SchemaTypes, Types } from 'mongoose';
import { RFQStatus } from '@shared/constants';

@Schema({
  collection: 'rfqs',
  versionKey: false,
  timestamps: true,
})
export class RFQ extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'job-requests' })
  jobRequestId: string;

  @Prop({ type: String, required: false, default: RFQStatus.PENDING })
  status?: string;
}

export const RFQSchema = SchemaFactory.createForClass(RFQ);

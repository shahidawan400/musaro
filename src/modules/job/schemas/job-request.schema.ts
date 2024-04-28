import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { SchemaTypes } from 'mongoose';
import { IRFQAvailability } from '../interfaces';

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class MetaData extends AbstractSchema<string> {
  @Prop({
    type: {
      startDate: Date,
      endDate: Date,
    },
    required: false,
  })
  availability?: IRFQAvailability;

  @Prop({ type: Array<Number>, required: false })
  rating?: number[];

  @Prop({ type: String, required: false })
  providerType?: string;
}
const MetaDataSchema = SchemaFactory.createForClass(MetaData);
@Schema({
  collection: 'job-requests',
  versionKey: false,
  timestamps: true,
})
export class JobRequest extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'professions' })
  professionId: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [{ type: String }], required: true })
  media: string[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'users' }],
    required: false,
    default: [],
  })
  approvals?: string[];

  @Prop({ type: MetaDataSchema, required: false })
  metadata?: MetaData;
}

export const JobRequestSchema = SchemaFactory.createForClass(JobRequest);

import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'jobs',
  versionKey: false,
  timestamps: true,
})
export class Job extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true, trim: true })
  projectOwnerMobile: string;

  @Prop({ type: String, required: true, trim: true })
  projectOwnerWhatsapp: string;

  @Prop({ type: [{ type: String }], required: true })
  media: string[];

  @Prop({ type: Boolean, required: false, default: true })
  isVisible?: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  isActive?: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);

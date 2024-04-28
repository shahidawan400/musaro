import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'attachments',
  versionKey: false,
  timestamps: true,
})
export class Attachment extends AbstractSchema<string> {
  @Prop({ type: String, required: true })
  attachment: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  createdBy: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);

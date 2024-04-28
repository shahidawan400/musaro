import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { ReviewType } from '@shared/constants';
import { SchemaTypes } from 'mongoose';

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class RatingDetails extends AbstractSchema<string> {
  @Prop({ type: Number, required: false })
  overallExperience: number;
  @Prop({ type: Number, required: false })
  responseTime?: number;
  @Prop({ type: Number, required: false })
  price?: number;
  @Prop({ type: Number, required: false })
  quality?: number;
  @Prop({ type: Number, required: false })
  commitment?: number;
}
const RatingDetailsSchema = SchemaFactory.createForClass(RatingDetails);

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class ReviewDetails extends AbstractSchema<string> {
  @Prop({
    required: true,
    enum: [ReviewType.PUBLIC, ReviewType.PRIVATE],
    default: ReviewType.PUBLIC,
  })
  type: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
  userId: string;

  @Prop({ type: String, required: false })
  comment?: string;

  @Prop({ type: Date, required: false, default: Date.now() })
  date?: Date;

  @Prop({ type: RatingDetailsSchema, required: true })
  ratings: RatingDetails;
}

const ReviewDetailsSchema = SchemaFactory.createForClass(ReviewDetails);

@Schema({
  collection: 'reviews',
  versionKey: false,
  timestamps: true,
})
export class Review extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
  providerId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'jobs', required: true })
  jobId: string;

  @Prop({
    type: [{ type: ReviewDetailsSchema, required: false }],
  })
  reviews: ReviewDetails[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

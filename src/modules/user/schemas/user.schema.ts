import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { AppLanguage, ProfileStatus, UserRole } from '@shared/constants';
import { IOTP } from '@shared/interfaces';
import { SchemaTypes } from 'mongoose';

@Schema({
  _id: false,
  versionKey: false,
})
class ProviderDetail extends AbstractSchema<string> {
  @Prop({ type: String, required: true })
  type?: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'professions' })
  professionId?: string;

  @Prop({ type: String, required: true })
  businessName?: string;

  @Prop({ type: String, required: true })
  serviceDescription?: string;

  @Prop({ type: String, required: true })
  yearsOfExperience?: string;

  @Prop({ type: String, required: true })
  idNumber?: string;

  @Prop({ type: String, required: true })
  idPicture?: string;

  @Prop({ type: String, required: true })
  whatsapp?: string;

  @Prop({ type: String, required: false })
  officeNumber?: string;

  @Prop({ type: Boolean, required: false, default: false })
  unAvailable?: boolean;

  @Prop({ type: Date, required: false })
  unAvailableStartDate?: Date;

  @Prop({ type: Date, required: false })
  unAvailableEndDate?: Date;

  @Prop({ type: Boolean, required: false, default: false })
  isLocationLimited?: boolean;

  @Prop({ type: [String], required: false })
  limitedCities?: string[];
}
const ProviderDetailSchema = SchemaFactory.createForClass(ProviderDetail);

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class ReviewDetails extends AbstractSchema<string> {
  @Prop({ type: Number, default: 0, required: false })
  avgRating?: number;
  @Prop({ type: Number, default: 0, required: false })
  avgResponseTime?: number;
}
const ReviewDetailsSchema = SchemaFactory.createForClass(ReviewDetails);

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class UserMetaData extends AbstractSchema<string> {
  @Prop({
    type: String,
    required: false,
    default: AppLanguage.ENGLISH,
    enum: AppLanguage,
  })
  appLanguage?: string;

  @Prop({
    type: {
      code: { type: Number, required: true },
      expiresAt: { type: Date, required: true },
    },
  })
  otp: IOTP;

  @Prop({ type: Boolean, required: false, default: false })
  isVerified?: boolean;

  @Prop({ type: Boolean, required: false })
  isProfileCompleted?: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  isActive?: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  isApproved?: boolean;

  @Prop({
    type: String,
    required: false,
    default: ProfileStatus.APPROVAL_PENDING,
  })
  reason?: string;

  @Prop({ type: Boolean, required: false, default: true })
  isNotificationOn?: boolean;

  @Prop({ type: String, required: false })
  fcmToken?: string;

  @Prop({ type: ReviewDetailsSchema, required: false })
  reviewDetails?: ReviewDetails;
}
const UserMetaDataSchema = SchemaFactory.createForClass(UserMetaData);

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class User extends AbstractSchema<string> {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  mobile: string;

  @Prop({ type: String, required: true, enum: UserRole })
  role: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: false })
  profilePicture?: string;

  @Prop({ type: UserMetaDataSchema, required: false })
  metadata?: UserMetaData;

  // Below fields are specifically for service provider

  @Prop({ type: ProviderDetailSchema, required: false })
  serviceDetail?: ProviderDetail;
}

export const UserSchema = SchemaFactory.createForClass(User);

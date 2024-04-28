import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { WorkshopStatus } from '@shared/constants';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Ticket extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  customerId: string; // Customer ID who purchased the ticket

  @Prop({ type: Number, required: true })
  quantity: number; // Quantity of tickets purchased

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'payments' })
  paymentId: string; // Reference to the payment for which the ticket is associated
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class WorkshopLocation extends AbstractSchema<string> {
  // @Prop({ type: String, required: true })
  // address: string;

  @Prop({ type: String, required: true })
  longitude: string;

  @Prop({ type: String, required: true })
  latitude: string;
}

export const WorkshopLocationSchema =
  SchemaFactory.createForClass(WorkshopLocation);

@Schema({
  collection: 'workshops',
  versionKey: false,
  timestamps: true,
})
export class Workshop extends AbstractSchema<string> {
  @Prop({ type: String, required: true })
  workshopName: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: Date, required: true })
  startDate: string;

  @Prop({ type: Date, required: true })
  endDate: string;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: String, required: true })
  endTime: string;

  @Prop({ type: Number, required: true })
  pricePerPerson: number;

  @Prop({ type: Number, required: true })
  maxPeople: number;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: WorkshopLocationSchema, required: true })
  location: WorkshopLocation;

  @Prop({ type: [{ type: String }], required: true })
  media: string[];

  @Prop({
    type: String,
    required: true,
    enum: WorkshopStatus,
    default: WorkshopStatus.PENDING,
  })
  status?: string;

  @Prop({ type: String, required: false, default: 'Pending Approval' })
  reason?: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  createdBy: string;

  @Prop({ type: Number, required: true, default: 0 })
  remainingSeats: number; // Number of remaining seats for the workshop

  @Prop({ type: [{ type: TicketSchema }], required: false, default: [] })
  tickets?: Ticket[]; // Array of tickets associated with the workshop
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);

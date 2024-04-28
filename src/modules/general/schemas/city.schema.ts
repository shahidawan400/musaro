import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';

@Schema({
  collection: 'cities',
  versionKey: false,
  timestamps: false,
})
export class City extends AbstractSchema<string> {
  @Prop({ type: String, required: true })
  name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '@shared/abstracts';
import { FavouriteType } from '@shared/constants';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'favourites',
  versionKey: false,
  timestamps: true,
})
export class Favourite extends AbstractSchema<string> {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'users' })
  favouriteBy: string; // User ID who add the favorite

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  favouriteTo: string; // PROFILE or WORKSHOP or TREND ID which will be added as favourite

  @Prop({ type: String, required: true, enum: FavouriteType })
  type: string; // Type of Favourite (e.g. PROFILE, WORKSHOP, TREND)
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);

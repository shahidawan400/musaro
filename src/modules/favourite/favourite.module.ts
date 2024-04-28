import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteRepository } from './favourite.repository';
import { Favourite, FavouriteSchema } from './schema';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favourite.name, schema: FavouriteSchema },
    ]),
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService, FavouriteRepository],
  exports: [FavouriteRepository],
})
export class FavouriteModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { UserModule } from '../user';
import { ActivityLogModule } from '../activity-log';
import { FavouriteModule } from '../favourite/favourite.module';
import { FavouriteRepository } from '../favourite/favourite.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UserModule,
    ActivityLogModule,
    FavouriteModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [],
})
export class ReviewModule {}

import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import mongoose, { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { IGetReview, IReviewFilter, IReviewRepository } from './interfaces';
import { Review } from './schema';
import { getDataByDateRange } from '@shared/utils';

@Injectable()
export class ReviewRepository
  extends AbstractRepository<Review>
  implements IReviewRepository<Review>
{
  protected readonly logger = new Logger(ReviewRepository.name);

  constructor(
    @InjectModel(Review.name) reviewModel: Model<Review>,
    @InjectConnection() connection: Connection,
  ) {
    super(reviewModel, connection);
  }

  async findReiewByFilter(payload: IReviewFilter) {
    try {
      const { providerId, option, isFilter = true } = payload;
      let rangeMatch = {};
      if (isFilter) {
        const { startDate, endDate } = getDataByDateRange(
          option,
          payload.startDate,
          payload.endDate,
        );
        rangeMatch = {
          'reviews.date': {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }

      const result = await this.aggregate([
        {
          $match: {
            providerId: new mongoose.Types.ObjectId(providerId),
          },
        },
        {
          $unwind: {
            path: '$reviews',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            ...rangeMatch,
          },
        },
        {
          $project: {
            _id: 0,
            providerId: 1,
            jobId: 1,
            type: '$reviews.type',
            ratings: '$reviews.ratings',
          },
        },
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findReviews(payload: IGetReview) {
    try {
      const { providerId, jobId, limit, offset } = payload;

      return await this.paginate({
        limit,
        offset,
        sort: {
          type: 1,
          createdat: -1,
        },
        pipelines: [
          {
            $match: {
              providerId: new mongoose.Types.ObjectId(providerId),
              jobId: new mongoose.Types.ObjectId(jobId),
            },
          },
          {
            $unwind: {
              path: '$reviews',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'reviews.userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              providerId: 1,
              jobId: 1,
              type: '$reviews.type',
              userId: '$reviews.userId',
              comment: '$reviews.comment',
              userName: '$user.name',
              createdat: '$reviews.date',
              ratings: '$reviews.ratings',
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import {
  ICalcStats,
  ICreateReview,
  IGetReview,
  IRating,
  IReviewService,
  IStatistics,
} from './interfaces';
import { ReviewRepository } from './review.repository';
import { ActivityLogType, ReviewType } from '@shared/constants';
import { UserRepository } from '../user';
import mongoose from 'mongoose';
import { ActivityLogRepository } from '../activity-log';
import { FavouriteRepository } from '../favourite/favourite.repository';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private activityLogRepository: ActivityLogRepository,
    private favouriteRepository: FavouriteRepository,
  ) {}

  async create(payload: ICreateReview) {
    try {
      const { jobId, providerId, userId, type, comment, ...restPayload } =
        payload;
      const date = new Date();

      await this.reviewRepository.findOneAndUpdate(
        { providerId, jobId },
        {
          $push: {
            reviews: {
              type,
              userId,
              comment,
              date,
              ratings: { ...restPayload },
            },
          },
        },
        { upsert: true },
      );

      // async call , no need to wait , will run on background
      this.calculateStatistics({
        providerId,
        isFilter: false,
        isSave: true,
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  async list(payload: IGetReview) {
    try {
      return await this.reviewRepository.findReviews(payload);
    } catch (error) {
      throw error;
    }
  }

  async statistics(payload: IStatistics) {
    const { providerId, option } = payload;

    const [statistics, activityLog, favourite] = await Promise.all([
      this.calculateStatistics({ ...payload, isFilter: true, isSave: false }),
      this.activityLogRepository.findByFilter(
        {
          userId: providerId,
          logType: ActivityLogType.VIEW_PROFILE,
          option,
          isFilter: true,
        },
        // {
        //   _id: 1,
        // },
      ),
      this.favouriteRepository.findByFilter({
        option,
        isFilter: true,
        favouriteTo: providerId,
      }),
    ]);

    const { avgRating, avgResponseTime, reviewCount } = statistics;
    const viewCount = activityLog.length ?? 0;
    const favouriteCount = favourite.length ?? 0;

    return {
      viewCount, // monthly views
      favouriteCount, // monthly favourite
      avgRating, // start this month
      reviewCount, // monthly review
      avgResponseTime, // average response time
    };
  }

  private async calculateStatistics(payload: ICalcStats) {
    try {
      const { providerId, isSave = false } = payload;
      const ratingMap = new Map([
        [
          ReviewType.PUBLIC,
          {
            overallExperience: { sum: 0, count: 0 },
            responseTime: { sum: 0, count: 0 },
          },
        ],
        [
          ReviewType.PRIVATE,
          {
            overallExperience: { sum: 0, count: 0 },
            responseTime: { sum: 0, count: 0 },
            quantity: { sum: 0, count: 0 },
            price: { sum: 0, count: 0 },
            commitment: { sum: 0, count: 0 },
          },
        ],
      ]);

      const reviews = await this.reviewRepository.findReiewByFilter(payload);

      for (const review of reviews) {
        const { type } = review;
        const categoryRating = ratingMap.get(type);

        if (!categoryRating) {
          console.error(`Invalid review type: ${type}`);
          continue; // Skip to the next iteration if type is invalid
        }

        categoryRating.overallExperience.sum +=
          review.ratings?.overallExperience || 0;
        categoryRating.overallExperience.count++;
        categoryRating.responseTime.sum += review.ratings?.responseTime || 0;
        categoryRating.responseTime.count++;

        if (type === ReviewType.PRIVATE) {
          categoryRating.quantity.sum += review.ratings?.quantity || 0;
          categoryRating.quantity.count++;
          categoryRating.price.sum += review.ratings?.price || 0;
          categoryRating.price.count++;
          categoryRating.commitment.sum += review.ratings?.commitment || 0;
          categoryRating.commitment.count++;
        }
      }

      const publicRating = ratingMap.get(ReviewType.PUBLIC);
      const privateRating = ratingMap.get(ReviewType.PRIVATE);

      const publicReview = this.public(publicRating);
      const privateReview = this.private(privateRating);

      const averageRating =
        +(publicReview * 0.30 + privateReview * 0.70).toFixed(2) * 10;

      const avgRating = this.calcStarRatingFromAvg(averageRating);
      const avgResponseTime = this.calcAvgResponseTime(
        publicRating,
        privateRating,
      );
      const reviewCount = this.calcReviewCount(publicRating, privateRating);

      if (isSave) {
        const userRatingUpdate = await this.userRepository.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(providerId),
          },
          {
            $set: {
              'metadata.reviewDetails.avgRating': avgRating,
              'metadata.reviewDetails.avgResponseTime': avgResponseTime,
            },
          },
          { notFoundThrowError: false },
        );
        if (!userRatingUpdate)
          Logger.error(
            `Avg Rating & Response not updated for user ${providerId}`,
          );
      }

      return {
        avgRating,
        avgResponseTime,
        reviewCount,
      };
    } catch (error) {
      throw error;
    }
  }

  private public(publicRating: IRating) {
    if (!publicRating) {
      console.error('Public rating data is missing');
      return 0;
    }
    const rating: IRating = JSON.parse(JSON.stringify(publicRating));
    rating.overallExperience.count *= 5;
    // rating.responseTime.count *= 5;
    return (
      // (rating.responseTime.sum / (rating.responseTime.count || 1)) * 1
      // +
      (rating.overallExperience.sum / (rating.overallExperience.count || 1)) * 1
    );
  }

  private private(privateRating: IRating) {
    if (!privateRating) {
      console.error('Private rating data is missing');
      return 0;
    }
    const rating: IRating = JSON.parse(JSON.stringify(privateRating));
    rating.overallExperience.count *= 5;
    // rating.responseTime.count *= 5;
    rating.quantity.count *= 5;
    rating.price.count *= 5;
    rating.commitment.count *= 5;
    return (
      // (rating.responseTime.sum / (rating.responseTime.count || 1)) * 0.2 +
      (rating.overallExperience.sum / (rating.overallExperience.count || 1)) *
        0.25 +
      (rating.quantity.sum / (rating.quantity.count || 1)) * 0.25 +
      (rating.price.sum / (rating.price.count || 1)) * 0.25 +
      (rating.commitment.sum / (rating.commitment.count || 1)) * 0.25
    );
  }

  private calcStarRatingFromAvg(averageRating: number) {
    if (averageRating < 0 || averageRating > 5) {
      console.warn(`Range will be between from 0 to 5`);
    }

    const avgRating = Math.max(0, Math.min(Math.round(averageRating), 5)); // Scale to be between 0 and 5

    return avgRating;
  }

  private calcAvgResponseTime(publicRating: IRating, privateRating: IRating) {
    const sumPublic = publicRating?.responseTime.sum ?? 0;
    const countPublic = publicRating?.responseTime.count ?? 0;
    const sumPrivate = privateRating?.responseTime.sum ?? 0;
    const countPrivate = privateRating?.responseTime.count ?? 0;

    const totalSum = sumPublic + sumPrivate;
    const totalCount = countPublic + countPrivate;

    const avgResponseTime = totalCount !== 0 ? totalSum / totalCount : 0;
    // const avgResponseTimeScaled = Math.max(0, Math.min(avgResponseTime * 5, 5)); // Scale to be between 0 and 5
    const avgResponseValue = Math.round(avgResponseTime);

    return avgResponseValue;
  }

  private calcReviewCount(publicRating: IRating, privateRating: IRating) {
    const countPublic = publicRating?.responseTime.count ?? 0;
    const countPrivate = privateRating?.responseTime.count ?? 0;
    const totalCount = countPublic + countPrivate;

    return totalCount;
  }
}

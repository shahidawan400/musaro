import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import mongoose, { Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Favourite } from './schema';
import {
  IFavouriteRepository,
  IFindByFilter,
  IListUserFavourites,
} from './interfaces';
import { getDataByDateRange } from '@shared/utils';

@Injectable()
export class FavouriteRepository
  extends AbstractRepository<Favourite>
  implements IFavouriteRepository<Favourite>
{
  protected readonly logger = new Logger(FavouriteRepository.name);

  constructor(
    @InjectModel(Favourite.name) favouriteModel: Model<Favourite>,
    @InjectConnection() connection: Connection,
  ) {
    super(favouriteModel, connection);
  }
  async listUserFavourites(payload: IListUserFavourites) {
    const { userId, type } = payload;
    const pipeline = [
      {
        $match: {
          favouriteBy: new Types.ObjectId(userId),
          ...(type && { type }),
        },
      },
      {
        $facet: {
          profileDetails: [
            {
              $match: { type: 'PROFILE' },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'favouriteTo',
                foreignField: '_id',
                as: 'userDetails',
              },
            },
            {
              $project: {
                _id: 1,
                favouriteBy: 1,
                favouriteTo: 1,
                type: 1,
                createdAt: 1,
                updatedAt: 1,
                userDetails: {
                  _id: { $arrayElemAt: ['$userDetails._id', 0] },
                  name: { $arrayElemAt: ['$userDetails.name', 0] },
                  mobile: { $arrayElemAt: ['$userDetails.mobile', 0] },
                  role: { $arrayElemAt: ['$userDetails.role', 0] },
                  username: { $arrayElemAt: ['$userDetails.username', 0] },
                  city: { $arrayElemAt: ['$userDetails.city', 0] },
                  avgRating: {
                    $arrayElemAt: [
                      '$userDetails.metadata.reviewDetails.avgRating',
                      0,
                    ],
                  },
                  avgResponseTime: {
                    $arrayElemAt: [
                      '$userDetails.metadata.reviewDetails.avgResponseTime',
                      0,
                    ],
                  },
                  serviceDetail: {
                    $arrayElemAt: ['$userDetails.serviceDetail', 0],
                  },
                },
              },
            },
            {
              $unwind: '$userDetails',
            },
          ],
          workshopDetails: [
            {
              $match: { type: 'WORKSHOP' },
            },
            {
              $lookup: {
                from: 'workshops',
                localField: 'favouriteTo',
                foreignField: '_id',
                as: 'workshopDetails',
              },
            },
            {
              $unwind: '$workshopDetails',
            },
            {
              $project: {
                'workshopDetails.tickets': 0,
              },
            },
          ],
          trendDetails: [
            {
              $match: { type: 'TREND' },
            },
            {
              $lookup: {
                from: 'trends',
                localField: 'favouriteTo',
                foreignField: '_id',
                as: 'trendDetails',
              },
            },
          ],
        },
      },
      {
        $project: {
          favorites: {
            $concatArrays: [
              '$profileDetails',
              '$workshopDetails',
              '$trendDetails',
            ],
          },
        },
      },
      {
        $unwind: '$favorites',
      },
      {
        $replaceRoot: { newRoot: '$favorites' },
      },
    ];
    return await this.aggregate(pipeline);
  }

  async findByFilter(filterQuery: IFindByFilter, projection?: object) {
    const { option, favouriteTo, isFilter = false } = filterQuery;

    let rangeMatch = {};

    if (isFilter) {
      const { startDate, endDate } = getDataByDateRange(
        option,
        filterQuery.startDate,
        filterQuery.endDate,
      );

      rangeMatch = {
        ...(option && {
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        }),
        ...(favouriteTo && { favouriteTo }),
      };
    }

    return await this.aggregate([
      {
        $match: {
          ...rangeMatch,
          favouriteTo,
        },
      },
      {
        $project: {
          _id: 0,
          ...projection,
        },
      },
    ]);
  }
}

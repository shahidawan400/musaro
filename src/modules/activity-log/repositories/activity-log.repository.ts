import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ActivityLog } from '../schema';
import { IActivityLogRepository, IFindByFilter } from '../interfaces';
import { cleanObject, getDataByDateRange } from '@shared/utils';

@Injectable()
export class ActivityLogRepository
  extends AbstractRepository<ActivityLog>
  implements IActivityLogRepository<ActivityLog>
{
  protected readonly logger = new Logger(ActivityLogRepository.name);

  constructor(
    @InjectModel(ActivityLog.name) activityLogModel: Model<ActivityLog>,
    @InjectConnection() connection: Connection,
  ) {
    super(activityLogModel, connection);
  }

  async findByFilter(filterQuery: IFindByFilter, projection?: object) {
    const {
      createdBy,
      userId,
      option,
      logType,
      isFilter = false,
    } = filterQuery;

    let rangeMatch = {};

    if (isFilter) {
      const { startDate, endDate } = getDataByDateRange(
        option,
        filterQuery.startDate,
        filterQuery.endDate,
      );

      rangeMatch = {
        ...(startDate &&
          endDate && {
            timestamp: {
              $gte: startDate,
              $lte: endDate,
            },
          }),
        ...(logType && { logType }),
        ...(createdBy && { createdBy }),
        ...(userId && { userId }),
      };
    }

    return await this.aggregate([
      {
        $match: {
          ...rangeMatch,
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

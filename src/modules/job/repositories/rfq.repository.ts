import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RFQ } from '../schemas';
import { IRFQRepository } from '../interfaces';

@Injectable()
export class RFQRepository
  extends AbstractRepository<RFQ>
  implements IRFQRepository<RFQ>
{
  protected readonly logger = new Logger(RFQRepository.name);

  constructor(
    @InjectModel(RFQ.name) rfqModel: Model<RFQ>,
    @InjectConnection() connection: Connection,
  ) {
    super(rfqModel, connection);
  }

  async listUserRFQs(payload: { userId: string }) {
    try {
      const { userId } = payload;
      const pipeline = [
        {
          $match: { userId: new Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'job-requests',
            localField: 'jobRequestId',
            foreignField: '_id',
            as: 'jobRequest',
          },
        },
        {
          $unwind: '$jobRequest',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'jobRequest.userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'professions',
            localField: 'jobRequest.professionId',
            foreignField: '_id',
            as: 'profession',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $unwind: '$profession',
        },
        {
          $project: {
            _id: 1,
            status: 1,
            userId: 1,
            jobRequest: {
              _id: 1,
              city: 1,
              address: 1,
              description: 1,
              media: 1,
              userDetail: {
                name: '$user.name',
                mobile: '$user.mobile',
                role: '$user.role',
                username: '$user.username',
                city: '$user.city',
              },
              professionDetail: {
                _id: '$profession._id',
                name: '$profession.name',
                description: '$profession.description',
              },
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];
      return await this.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  async getRFQ(payload: { rfqId: string }) {
    try {
      const { rfqId } = payload;
      const pipeline = [
        {
          $match: { _id: new Types.ObjectId(rfqId) },
        },
        {
          $lookup: {
            from: 'job-requests',
            localField: 'jobRequestId',
            foreignField: '_id',
            as: 'jobRequest',
          },
        },
        {
          $unwind: '$jobRequest',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'jobRequest.userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'professions',
            localField: 'jobRequest.professionId',
            foreignField: '_id',
            as: 'profession',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $unwind: '$profession',
        },
        {
          $project: {
            _id: 1,
            status: 1,
            userId: 1,
            jobRequest: {
              _id: 1,
              city: 1,
              address: 1,
              description: 1,
              media: 1,
              userDetail: {
                name: '$user.name',
                mobile: '$user.mobile',
                role: '$user.role',
                username: '$user.username',
                city: '$user.city',
              },
              professionDetail: {
                _id: '$profession._id',
                name: '$profession.name',
                description: '$profession.description',
              },
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];
      return await this.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ActivityLogType, UserRole } from '@shared/constants';
import {
  IUpdateProviderProfile,
  IListProviders,
  IProviderAvailability,
} from '../interfaces';
import { S3Service } from '@shared/services';
import { Types } from 'mongoose';
import { ActivityLogRepository } from 'src/modules/activity-log';

@Injectable()
export class ProviderService {
  constructor(
    private readonly userRepository: UserRepository,
    private activityLogRepository: ActivityLogRepository,
    private s3: S3Service,
  ) {}

  async getProviderProfile(payload: { userId: string }) {
    try {
      const { userId } = payload;

      // Increment provider's profile view count on user profile view.
      // if (providerId) {
      //   const activityPayload = {
      //     createdBy: userId,
      //     userId: providerId,
      //     logType: ActivityLogType.VIEW_PROFILE,
      //   };
      //   await this.activityLogRepository.create(activityPayload);
      // }

      return await this.userRepository.findOne(
        {
          _id: userId,
        },
        { password: 0, 'metadata.otp': 0 },
      );
    } catch (error) {
      throw error;
    }
  }

  async getProviderDetail(payload: { userId: string; createdBy: string }) {
    try {
      const userId = new Types.ObjectId(payload?.userId);
      const pipeline = [
        {
          $match: {
            _id: userId,
            role: UserRole.PROVIDER,
            'metadata.isActive': true,
            'metadata.isApproved': true,
          },
        },
        {
          $lookup: {
            from: 'jobs',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', userId] },
                      { $eq: ['$isVisible', true] },
                      { $eq: ['$isApproved', true] },
                    ],
                  },
                },
              },
            ],
            as: 'jobs',
          },
        },
      ];
      const providerDetail = await this.userRepository.aggregate(pipeline);
      await this.activityLogRepository.create({
        createdBy: payload.createdBy,
        userId: payload.userId,
        logType: ActivityLogType.VIEW_PROFILE,
      });
      return providerDetail;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(payload: IUpdateProviderProfile) {
    try {
      const { _id, city, ...restPayload } = payload;

      if (restPayload?.idPicture) {
        const url = `users/${_id}/identity/{uuid}`;
        restPayload.idPicture = (
          await this.s3.uploadFile(restPayload.idPicture, url)
        )?.url;
      }

      const response = await this.userRepository.findOneAndUpdate(
        {
          _id,
          role: UserRole.PROVIDER,
        },
        {
          $set: {
            ...(city && { city }),
            serviceDetail: restPayload,
          },
        },
        { projection: { serviceDetail: 1 } },
      );
      return response?.serviceDetail;
    } catch (error) {
      throw error;
    }
  }

  async listProviders(payload: IListProviders) {
    try {
      const { limit, offset, professionId } = payload;
      return await this.userRepository.paginate({
        filterQuery: {
          'serviceDetail.professionId': new Types.ObjectId(professionId),
          role: UserRole.PROVIDER,
          'metadata.isActive': true,
          'metadata.isApproved': true,
        },
        limit,
        offset,
        projection: {
          name: 1,
          mobile: 1,
          username: 1,
          city: 1,
          profilePicture: 1,
          'serviceDetail.type': 1,
          'serviceDetail.serviceDescription': 1,
          'serviceDetail.yearsOfExperience': 1,
          'serviceDetail.whatsapp': 1,
          'serviceDetail.officeNumber': 1,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async setAvailability(payload: IProviderAvailability) {
    try {
      const {
        userId,
        unAvailable,
        unAvailableStartDate = null,
        unAvailableEndDate = null,
        isLocationLimited,
        limitedCities = [],
      } = payload;

      await this.userRepository.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            'serviceDetail.unAvailable': unAvailable,
            'serviceDetail.unAvailableStartDate': unAvailableStartDate,
            'serviceDetail.unAvailableEndDate': unAvailableEndDate,
            'serviceDetail.isLocationLimited': isLocationLimited,
            'serviceDetail.limitedCities': limitedCities,
          },
        },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }
}

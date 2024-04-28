import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { S3Service } from '@shared/services';
import { ICreateJob, ICreateRFQ, IListJobs, IRespondRFQ } from '../interfaces';
import {
  JobRepository,
  JobRequestRepository,
  RFQRepository,
} from '../repositories';
import { Types } from 'mongoose';
import { ProfessionRepository } from 'src/modules/general/repositories';
import { NotificationService } from 'src/modules/notification/notification.service';
import { ISendNotification } from 'src/modules/notification/interfaces';
import { NotificationType, RFQStatus, UserRole } from '@shared/constants';
import { UserRepository } from 'src/modules/user';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobRequestRepository: JobRequestRepository,
    private readonly professionRepository: ProfessionRepository,
    private readonly notificationService: NotificationService,
    private readonly userRepository: UserRepository,
    private readonly rfqRepository: RFQRepository,
    private s3: S3Service,
  ) {}

  async createJob(payload: ICreateJob) {
    try {
      const {
        userId,
        media,
        projectOwnerMobile,
        projectOwnerWhatsapp,
        ...restPayload
      } = payload;

      // TODO: send review request link to project owner

      // Concurrent upload
      const uploadedMediaPromises = media.map(async (file) => {
        const fileUri = `jobs/${userId}/{uuid}`;
        const uploadedFile = await this.s3.uploadFile(file, fileUri);
        return uploadedFile.url;
      });

      // Wait for all media uploads to complete
      const uploadedMedia = await Promise.all(uploadedMediaPromises);

      return await this.jobRepository.create({
        userId,
        projectOwnerMobile,
        projectOwnerWhatsapp,
        ...restPayload,
        media: uploadedMedia,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateJob(payload: { jobId: string; isVisible: boolean }) {
    try {
      const { jobId, ...restPayload } = payload;
      return await this.jobRepository.findOneAndUpdate(
        { _id: jobId },
        { $set: { ...restPayload } },
      );
    } catch (error) {
      throw error;
    }
  }

  async getJob(payload: { jobId: string; role?: string }) {
    try {
      const { jobId, role } = payload;
      // TODO: if role = Customer then add rating & review data in response.
      return await this.jobRepository.findOne({ _id: jobId, isActive: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteJobRequest(payload: { jobId: string; userId?: string }) {
    try {
      const { jobId, userId } = payload;
      // TODO: add logic to request admin to delete job
      await this.jobRepository.findOne({ _id: jobId, userId });
      return null;
    } catch (error) {
      throw error;
    }
  }

  async listJobs(payload: IListJobs) {
    try {
      const { userId, limit, offset } = payload;
      return await this.jobRepository.paginate({
        filterQuery: {
          userId: new Types.ObjectId(userId),
          isActive: true,
        },
        limit,
        offset,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendJobRequest(payload: ICreateRFQ) {
    try {
      const { userId, professionId } = payload;

      const { name: serviceTitle } = await this.professionRepository.findOne({
        _id: professionId,
      });
      const jobRequest = await this.createJobRequest(payload);
      const users = await this.getRecipients(payload);
      this.sendRFQ({ userId, serviceTitle, jobRequest, users });

      return jobRequest;
    } catch (error) {
      throw error;
    }
  }

  async listUserRFQs(payload: { userId: string }) {
    try {
      return await this.rfqRepository.listUserRFQs(payload);
    } catch (error) {
      throw error;
    }
  }

  async getRFQ(payload: { rfqId: string }) {
    try {
      const rfq = await this.rfqRepository.getRFQ(payload);
      if (!rfq.length) throw new NotFoundException('Not Found!');
      return rfq[0];
    } catch (error) {
      throw error;
    }
  }

  async respondRFQ(payload: IRespondRFQ) {
    try {
      const { userId, rfqId, status } = payload;
      const rfq = await this.rfqRepository.findOne({ _id: rfqId, userId });
      const { jobRequestId, status: rfqStatus } = rfq;

      if (rfqStatus !== RFQStatus.PENDING)
        throw new BadRequestException(`RFQ already ${rfqStatus}`);

      await this.rfqRepository.findOneAndUpdate(
        { _id: rfqId },
        { $set: { status } },
      );
      if (status === RFQStatus.APPROVED) {
        try {
          await this.jobRequestRepository.findOneAndUpdate(
            { _id: jobRequestId },
            { $push: { approvals: userId } },
          );
        } catch (error) {
          console.error('error while updating jobRequest');
          await this.rfqRepository.findOneAndUpdate(
            { _id: rfqId },
            { $set: { status: RFQStatus.PENDING } },
          );
          throw error;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  private async createJobRequest(payload: ICreateRFQ) {
    const {
      userId,
      professionId,
      city,
      media,
      availability,
      rating,
      providerType,
      ...restPayload
    } = payload;
    try {
      // Concurrent upload
      const uploadedMediaPromises = media.map(async (file) => {
        const fileUri = `rfqs/${userId}/{uuid}`;
        const uploadedFile = await this.s3.uploadFile(file, fileUri);
        return uploadedFile.url;
      });

      // Wait for all media uploads to complete
      const uploadedMedia = await Promise.all(uploadedMediaPromises);

      return await this.jobRequestRepository.create({
        userId,
        professionId,
        city,
        ...restPayload,
        metadata: {
          ...(availability && { availability }),
          ...(rating && { rating }),
          ...(providerType && { providerType }),
        },
        media: uploadedMedia,
      });
    } catch (error) {
      throw error;
    }
  }

  private async getRecipients(payload: ICreateRFQ) {
    const { professionId, city, availability, rating, providerType } = payload;
    try {
      const request = {
        $and: [
          { role: UserRole.PROVIDER },
          { 'serviceDetail.professionId': new Types.ObjectId(professionId) },
          { ...(providerType && { 'serviceDetail.type': providerType }) },
          {
            ...(rating && {
              'metadata.reviewDetails.avgRating': { $in: [...rating] },
            }),
          },
          {
            ...(availability && {
              $or: [
                {
                  $and: [
                    { 'serviceDetail.unAvailable': true },
                    {
                      'serviceDetail.unAvailableStartDate': {
                        $gt: new Date(availability.startDate),
                      },
                    },
                    {
                      'serviceDetail.unAvailableStartDate': {
                        $gt: new Date(availability.endDate),
                      },
                    },
                  ],
                },
                {
                  $and: [
                    { 'serviceDetail.unAvailable': true },
                    {
                      'serviceDetail.unAvailableEndDate': {
                        $lt: new Date(availability.startDate),
                      },
                    },
                    {
                      'serviceDetail.unAvailableEndDate': {
                        $lt: new Date(availability.endDate),
                      },
                    },
                  ],
                },
                { 'serviceDetail.unAvailable': false },
              ],
            }),
          },
          {
            $or: [
              {
                'serviceDetail.isLocationLimited': true,
                'serviceDetail.limitedCities': { $in: [city] },
              },
              { 'serviceDetail.isLocationLimited': false },
            ],
          },
        ],
      };
      return await this.userRepository.find(request, { _id: 1 });
    } catch (error) {
      throw error;
    }
  }

  private async sendRFQ(payload: any): Promise<void> {
    try {
      const { userId, serviceTitle, jobRequest, users } = payload;
      const jobRequestId = jobRequest._id.toString();
      const recipients = [];
      const rfqPayload = users.map((user) => {
        let id = user._id.toString();
        recipients.push(id);
        return {
          userId: id,
          jobRequestId: jobRequestId,
        };
      });
      await this.rfqRepository.createMany(rfqPayload);

      // await this.notificationService.sendNotification({
      //   notificationType: NotificationType.RFQ,
      //   senderId: userId,
      //   recipientsId: recipients,
      //   title: NotificationType.RFQ,
      //   message: 'Job Request',
      //   data: {
      //     serviceTitle,
      //     ...jobRequest,
      //   },
      // });
    } catch (error) {
      console.error('Error in sending RFQ ', error);
    }
  }
}

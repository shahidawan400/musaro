import { Injectable } from '@nestjs/common';
import { IActivityLogService } from '../interfaces';
import { ActivityLogRepository } from '../repositories/activity-log.repository';

@Injectable()
export class ActivityLogService implements IActivityLogService {
  constructor(private activityLogRepository: ActivityLogRepository) {}

  async createActivityLog(payload: any): Promise<void> {
    try {
      await this.activityLogRepository.create(payload);
    } catch (error) {
      console.log('Error while creating Log! ', error?.message);
    }
  }
}

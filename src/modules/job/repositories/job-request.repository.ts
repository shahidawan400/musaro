import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { JobRequest } from '../schemas';
import { IJobRequestRepository } from '../interfaces';

@Injectable()
export class JobRequestRepository
  extends AbstractRepository<JobRequest>
  implements IJobRequestRepository<JobRequest>
{
  protected readonly logger = new Logger(JobRequestRepository.name);

  constructor(
    @InjectModel(JobRequest.name) jobRequestModel: Model<JobRequest>,
    @InjectConnection() connection: Connection,
  ) {
    super(jobRequestModel, connection);
  }
}

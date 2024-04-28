import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Job } from '../schemas';
import { IJobRepository } from '../interfaces';

@Injectable()
export class JobRepository
  extends AbstractRepository<Job>
  implements IJobRepository<Job>
{
  protected readonly logger = new Logger(JobRepository.name);

  constructor(
    @InjectModel(Job.name) jobModel: Model<Job>,
    @InjectConnection() connection: Connection,
  ) {
    super(jobModel, connection);
  }
}

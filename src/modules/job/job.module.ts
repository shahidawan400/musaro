import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Job,
  JobRequest,
  JobRequestSchema,
  JobSchema,
  RFQ,
  RFQSchema,
} from './schemas';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from '../user';
import {
  JobRepository,
  JobRequestRepository,
  RFQRepository,
} from './repositories';
import { NotificationModule } from '../notification/notification.module';
import { GeneralModule } from '../general/general.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MongooseModule.forFeature([
      { name: JobRequest.name, schema: JobRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: RFQ.name, schema: RFQSchema }]),
    SharedModule,
    UserModule,
    GeneralModule,
    NotificationModule,
  ],
  controllers: [JobController],
  providers: [JobService, JobRepository, JobRequestRepository, RFQRepository],
  exports: [JobRepository],
})
export class JobModule {}

import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Workshop } from '../schemas';
import { IWorkshopRepository } from '../interfaces';

@Injectable()
export class WorkshopRepository
  extends AbstractRepository<Workshop>
  implements IWorkshopRepository<Workshop>
{
  protected readonly logger = new Logger(WorkshopRepository.name);

  constructor(
    @InjectModel(Workshop.name) WorkshopModel: Model<Workshop>,
    @InjectConnection() connection: Connection,
  ) {
    super(WorkshopModel, connection);
  }
}

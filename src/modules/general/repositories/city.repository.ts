import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { City } from '../schemas';
import { ICityRepository } from '../interfaces';

@Injectable()
export class CityRepository
  extends AbstractRepository<City>
  implements ICityRepository<City>
{
  protected readonly logger = new Logger(CityRepository.name);

  constructor(
    @InjectModel(City.name) cityModel: Model<City>,
    @InjectConnection() connection: Connection,
  ) {
    super(cityModel, connection);
  }
}

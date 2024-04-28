import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Profession } from '../schemas';
import { IProfessionRepository, IUpdateProfession } from '../interfaces';
import { S3Service } from '@shared/services';

@Injectable()
export class ProfessionRepository
  extends AbstractRepository<Profession>
  implements IProfessionRepository<Profession>
{
  protected readonly logger = new Logger(ProfessionRepository.name);

  constructor(
    private s3: S3Service,
    @InjectModel(Profession.name) professionModel: Model<Profession>,
    @InjectConnection() connection: Connection,
  ) {
    super(professionModel, connection);
  }

  async updateProfession(payload: IUpdateProfession) {
    try {
      const { professionId, name, description, img } = payload;
      const profession = await this.model.findById(professionId);
      if (!profession) {
        throw new NotFoundException('Profession not found');
      }

      if (img && profession.img) {
        await this.s3.deleteFile(profession.img);
        profession.img = (
          await this.s3.uploadFile(payload.img, `profession/{uuid}`)
        )?.url;
      }

      profession.name = name || profession.name;
      profession.description = description || profession.description;

      return await profession.save();
    } catch (error) {
      throw error;
    }
  }
}

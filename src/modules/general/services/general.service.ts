import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user';
import {
  ICreateAttachment,
  ICreateProfession,
  IUpdateAppLanguage,
  IUpdateProfession,
} from '../interfaces';
import { S3Service } from '@shared/services';
import {
  AttachmentRepository,
  CityRepository,
  ProfessionRepository,
} from '../repositories';
import * as dayjs from 'dayjs';

@Injectable()
export class GeneralService {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly professionRepository: ProfessionRepository,
    private readonly cityRepository: CityRepository,
    private readonly userRepository: UserRepository,
    private s3: S3Service,
  ) {}

  async updateAppLanguage(payload: IUpdateAppLanguage) {
    try {
      const { userId, appLanguage } = payload;
      await this.userRepository.findOneAndUpdate(
        { _id: userId },
        {
          $set: { 'metadata.appLanguage': appLanguage },
        },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }

  async createProfession(payload: ICreateProfession) {
    try {
      if (payload?.img) {
        const url = `profession/{uuid}`;
        payload.img = (await this.s3.uploadFile(payload.img, url))?.url;
      }
      return await this.professionRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async updateProfession(payload: IUpdateProfession) {
    try {
      return await this.professionRepository.updateProfession(payload);
    } catch (error) {
      throw error;
    }
  }

  async getProfession(payload: { professionId: string }) {
    try {
      const { professionId } = payload;
      return await this.professionRepository.findOne({ _id: professionId });
    } catch (error) {
      throw error;
    }
  }

  async listProfessions(payload: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    try {
      const { limit, offset, status } = payload;
      const sort = { name: 1 };
      let response = null;
      if (limit > 0 && offset >= 0) {
        let data = await this.professionRepository.paginate({
          filterQuery: { ...(status && { status }) },
          limit,
          offset,
          sort,
        });
        response = data;
      } else {
        response = await this.professionRepository.find(
          { ...(status && { status }) },
          {},
          {
            sort,
          },
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addCity(payload: { name: string }) {
    try {
      let { name } = payload;
      name = name.toUpperCase();
      return await this.cityRepository.findOneAndUpdate(
        { name },
        { name },
        { upsert: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async getCity(payload: { cityId: string }) {
    try {
      const { cityId } = payload;
      return await this.cityRepository.findOne({ _id: cityId });
    } catch (error) {
      throw error;
    }
  }

  async updateCity(payload: { cityId: string; name: string }) {
    try {
      const { cityId, name } = payload;
      return await this.cityRepository.findOneAndUpdate(
        { _id: cityId },
        { name: name.toUpperCase() },
      );
    } catch (error) {
      throw error;
    }
  }

  async listCities(payload: { limit?: number; offset?: number }) {
    try {
      const { limit, offset } = payload;
      const projection = { name: 1 };
      const sort = { name: 1 };
      let response = null;
      if (limit > 0 && offset >= 0) {
        let data = await this.cityRepository.paginate({
          limit,
          offset,
          sort,
          projection,
        });
        // data.cities = data.cities.map((city) => city.name);
        response = data;
      } else {
        response = await this.cityRepository.find({}, projection, { sort });
        // const cities =
        // response = cities.map((city) => city.name);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCity(payload: { cityId: string }) {
    try {
      const { cityId } = payload;
      return await this.cityRepository.findOneAndDelete({ _id: cityId });
    } catch (error) {
      throw error;
    }
  }

  // async createAttachment(payload: ICreateAttachment) {
  //   try {
  //     const { userId, module, attachment } = payload;
  //     console.log('1 ====> ', dayjs().format('HH:mm:ss'));
  //     const s3Url = (
  //       await this.s3.uploadFile(attachment, `${module}/${userId}/{uuid}`)
  //     )?.url;
  //     console.log('2 ====> ', dayjs().format('HH:mm:ss'));

  //     return await this.attachmentRepository.create({
  //       attachment: s3Url,
  //       createdBy: userId,
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

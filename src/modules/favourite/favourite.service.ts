import { Injectable } from '@nestjs/common';
import {
  IListUserFavourites,
  IFavouriteService,
  ISaveFavourite,
} from './interfaces';
import { FavouriteRepository } from './favourite.repository';

@Injectable()
export class FavouriteService implements IFavouriteService {
  constructor(private favouriteRepository: FavouriteRepository) {}

  async create(payload: ISaveFavourite) {
    try {
      await this.favouriteRepository.create({
        ...payload,
      });
      return null;
    } catch (error) {
      throw error;
    }
  }

  async listUserFavourites(payload: IListUserFavourites) {
    try {
      return await this.favouriteRepository.listUserFavourites(payload);
    } catch (error) {
      throw error;
    }
  }
}

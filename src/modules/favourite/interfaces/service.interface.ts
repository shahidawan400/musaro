import { IListUserFavourites, ISaveFavourite } from './favourite.interface';

export interface IFavouriteService {
  create(payload: ISaveFavourite);
  listUserFavourites(payload: IListUserFavourites);
}

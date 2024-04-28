import { DateRangeOption, FavouriteType } from '@shared/constants';

export interface ISaveFavourite {
  favouriteBy: string;
  favouriteTo: string;
  type: string;
}

export interface IListUserFavourites {
  userId: string;
  type?: string;
}

export interface IFindByFilter {
  favouriteTo: string;
  option?: DateRangeOption;
  startDate?: string;
  endDate?: string;
  isFilter?: true;
}

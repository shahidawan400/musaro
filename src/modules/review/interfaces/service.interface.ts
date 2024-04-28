import { ICreateReview, IGetReview } from './review.interface';

export interface IReviewService {
  create(payload: ICreateReview);
  list(payload: IGetReview);
  statistics(payload: any);
}

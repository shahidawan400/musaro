import { DateRangeOption, ReviewType } from '@shared/constants';

export interface ICreateReview {
  providerId: string;
  jobId: string;
  userId: string;
  type: string;
  overallExperience: number;
  responseTime: number;
  comment?: string;
  price?: number;
  quantity?: number;
  commitment?: number;
}

export interface IReviewFilter {
  providerId: string;
  option?: DateRangeOption;
  startDate?: string;
  endDate?: string;
  isFilter?: boolean;
}

export interface ICalcStats extends IReviewFilter {
  isSave?: boolean;
}

export interface IStatistics extends IReviewFilter {}

interface IReview {
  overallExperience: number;
  responseTime: number;
  price?: number;
  quantity?: number;
  commitment?: number;
}

export interface IAllReviews {
  _id: string;
  providerId: string;
  jobId: string;
  type: ReviewType;
  userId: string;
  comment: string;
  ratings: IReview;
  createdAt: string;
}

export interface IGetReview {
  limit: number;
  offset: number;
  providerId: string;
  jobId: string;
}

interface ICount {
  sum: number;
  count: number;
}

export interface IRating {
  overallExperience: ICount;
  responseTime: ICount;
  price?: ICount;
  quantity?: ICount;
  commitment?: ICount;
}

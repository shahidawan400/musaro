import { MediaObject } from '@shared/interfaces';

export interface ICreateJob {
  userId: string;
  title: string;
  description: string;
  city: string;
  projectOwnerMobile: string;
  projectOwnerWhatsapp: string;
  media: MediaObject[];
}

export interface IListJobs {
  userId: string;
  limit: number;
  offset: number;
}

export interface ICreateRFQ {
  userId: string;
  professionId: string;
  city: string;
  address: string;
  description: string;
  availability?: IRFQAvailability;
  rating?: number[];
  providerType?: string;
  media: MediaObject[];
}

export interface IRFQAvailability {
  startDate: string;
  endDate: string;
}

export interface IRespondRFQ {
  userId: string;
  rfqId: string;
  status: string;
}

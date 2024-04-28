import { MediaObject } from '@shared/interfaces';

export interface ICreateAttachment {
  userId: string;
  module: string;
  attachment: MediaObject;
}

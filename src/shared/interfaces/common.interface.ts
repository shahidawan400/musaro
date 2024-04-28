export interface IOTP {
  code: number;
  expiresAt: Date;
}

export type MediaObject = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: string;
  size: number;
};

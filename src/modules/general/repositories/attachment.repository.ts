import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Attachment } from '../schemas';
import { IAttachmentRepository } from '../interfaces';

@Injectable()
export class AttachmentRepository
  extends AbstractRepository<Attachment>
  implements IAttachmentRepository<Attachment>
{
  protected readonly logger = new Logger(AttachmentRepository.name);

  constructor(
    @InjectModel(Attachment.name) attachmentModel: Model<Attachment>,
    @InjectConnection() connection: Connection,
  ) {
    super(attachmentModel, connection);
  }
}

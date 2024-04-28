import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@shared/abstracts';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Payment } from '../schema/payment.schema';
import { IPaymentRepository } from '../interfaces';

@Injectable()
export class PaymentRepository
  extends AbstractRepository<Payment>
  implements IPaymentRepository<Payment>
{
  protected readonly logger = new Logger(PaymentRepository.name);

  constructor(
    @InjectModel(Payment.name) paymentModel: Model<Payment>,
    @InjectConnection() connection: Connection,
  ) {
    super(paymentModel, connection);
  }
}

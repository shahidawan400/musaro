import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentRepository } from './repositories/payment.repository';
import { MoyasarConfigService } from './utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 3,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        paramsSerializer: (params) => new URLSearchParams(params).toString(),
      }),
    }),
  ],
  exports: [
    PaymentService,
    PaymentRepository,
    // MoyasarConfigService
  ],
  controllers: [
    PaymentController
  ],
  providers: [MoyasarConfigService, PaymentService, PaymentRepository],
})
export class PaymentModule {}

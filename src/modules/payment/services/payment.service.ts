import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MoyasarConfigService } from '../utils';
import { Observable, firstValueFrom } from 'rxjs';
import { IListPaymentsQueryParams } from '../interfaces';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentStatus } from '@shared/constants';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpService,
    private moyasarConfigService: MoyasarConfigService,
    private paymentRepository: PaymentRepository,
  ) {}

  async createPayment(payload: any) {
    try {
      return await this.paymentRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async create(payload: any) {
    try {
      const requestConfig = this.moyasarConfigService.get('POST', 'payments', {
        ...payload,
        amount: payload.amount * 100,
      });

      const { data } = await firstValueFrom(this.http.request(requestConfig));
      // const paymentData = {
      //   userId: '65cab57d047f7ea9601da3a3',
      //   amount: payload?.amount,
      //   paymentOption: 'VISA',
      //   paymentType: 'SUBSCRIPTION',
      //   transactionId: data?.id,
      //   description: 'subscription fee',
      //   paymentDate: new Date(),
      // };
      // await this.paymentRepository.create(paymentData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(payload: any) {
    try {
      const { id, message } = payload;
      const requestConfig = this.moyasarConfigService.get(
        'GET',
        `payments/${id}`,
      );
      const { data } = await firstValueFrom(this.http.request(requestConfig));
      return await this.paymentRepository.findOneAndUpdate(
        {
          transactionId: data.id,
        },
        {
          $set: {
            paymentStatus:
              data.status === 'paid'
                ? PaymentStatus.SUCCESS
                : PaymentStatus.FAILED,
            description: message,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async listPayments(payload: IListPaymentsQueryParams) {
    const queryParams = Object.entries(payload)
      .map(([key, value]) => (value != null ? `${key}=${value}` : ''))
      .filter(Boolean)
      .join('&');

    const urlPath = `/payments${queryParams ? `?${queryParams}` : ''}`;
    const requestConfig = this.moyasarConfigService.get('GET', urlPath);
    return await firstValueFrom(this.http.request(requestConfig));
  }

  async fetchPayment(id: string) {
    try {
      const requestConfig = this.moyasarConfigService.get(
        'GET',
        `payments/${id}`,
      );
      const { data } = await firstValueFrom(this.http.request(requestConfig));
      return data;
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ResponseMessage, UserRole } from '@shared/constants';
import { IUpdateCustomerProfile } from '../interfaces';

@Injectable()
export class CustomerService {
  constructor(private readonly userRepository: UserRepository) {}

  async get(payload: { userId: string }) {
    try {
      const { userId } = payload;

      return await this.userRepository.findOne(
        {
          _id: userId,
        },
        { password: 0, otp: 0 },
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(payload: IUpdateCustomerProfile) {
    try {
      const { userId, ...restPayload } = payload;

      const response = await this.userRepository.findOneAndUpdate(
        {
          _id: userId,
          role: UserRole.CUSTOMER,
        },
        { $set: { ...restPayload } },
      );
      const { password, ...rest } = response;
      return rest;
    } catch (error) {
      throw error;
    }
  }
}

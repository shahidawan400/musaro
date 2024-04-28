import { Injectable } from '@nestjs/common';
import { SubscriptionPlanRepository } from '../repositories';
import {
  IGetSubscriptionPlan,
  IListSubscriptionPlan,
  ISubscriptionPlan,
  IUpdateSubscriptionPlan,
} from '../interfaces';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async createSubscriptionPlan(payload: ISubscriptionPlan) {
    try {
      return await this.subscriptionPlanRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriptionPlan(payload: IUpdateSubscriptionPlan) {
    try {
      const { planId, ...restPayload } = payload;
      return await this.subscriptionPlanRepository.findOneAndUpdate(
        {
          _id: planId,
        },
        { $set: { ...restPayload } },
      );
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionPlan(payload: IGetSubscriptionPlan) {
    try {
      return await this.subscriptionPlanRepository.findOne({
        ...payload,
      });
    } catch (error) {
      throw error;
    }
  }

  async listSubscriptionPlans(payload: IListSubscriptionPlan) {
    try {
      return await this.subscriptionPlanRepository.find({ ...payload });
    } catch (error) {
      throw error;
    }
  }
}

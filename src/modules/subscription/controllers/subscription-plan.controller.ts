import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { SubscriptionPlanService } from '../services';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators';
import {
  CreateSubscriptionPlanReqDto,
  GetSubscriptionPlanReqDto,
  ListSubscriptionPlanReqDto,
  SubscriptionPlanFilterReqDto,
  SubscriptionPlanReqDto,
  UpdateSubscriptionPlanReqDto,
} from '../dto';

@Controller('subscription-plan')
@ApiTags('Subscription Plan')
@ApiBearerAuth()
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async createSubscriptionPlan(@Body() payload: CreateSubscriptionPlanReqDto) {
    return await this.subscriptionPlanService.createSubscriptionPlan(payload);
  }

  @Patch(':planId')
  @Auth()
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async updateSubscriptionPlan(
    @Param() param: SubscriptionPlanReqDto,
    @Body() payload: UpdateSubscriptionPlanReqDto,
  ) {
    return await this.subscriptionPlanService.updateSubscriptionPlan({
      ...param,
      ...payload,
    });
  }

  @Get('list')
  @Auth()
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async listSubscriptionPlans(@Query() query: ListSubscriptionPlanReqDto) {
    return await this.subscriptionPlanService.listSubscriptionPlans(query);
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async getSubscriptionPlan(@Query() query: GetSubscriptionPlanReqDto) {
    const { planId } = query;
    return await this.subscriptionPlanService.getSubscriptionPlan({
      _id: planId,
    });
  }
}

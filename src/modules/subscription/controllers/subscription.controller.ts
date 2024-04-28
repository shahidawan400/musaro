import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CreateSubscriptionReqDto } from '../dto/subscription-req.dto';
import { SubscriptionService } from '../services';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators';

@Controller('subscription')
@ApiTags('Subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async createSubscription(
    @Req() req: any,
    @Body() payload: CreateSubscriptionReqDto,
  ) {
    const userId = (req?.user?._id).toString();
    return this.subscriptionService.createProviderSubscription({
      userId,
      ...payload,
    });
  }
}

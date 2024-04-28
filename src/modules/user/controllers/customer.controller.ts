import {
  Controller,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import {
  GetCustomerDetailResDto,
  UpdateCustomerProfileReqDto,
  UpdateProviderProfileResDto,
} from '../dto';
import { CustomerService } from '../services';

@Controller('customer')
@ApiTags('Customer')
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Auth()
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: UpdateProviderProfileResDto })
  async updateCustomerProfile(
    @Req() req: any,
    @Body() payload: UpdateCustomerProfileReqDto,
  ) {
    const { _id: userId } = req?.user;
    return await this.customerService.updateProfile({
      userId,
      ...payload,
    });
  }

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: GetCustomerDetailResDto })
  async get(@Req() req: any) {
    return await this.customerService.get({ userId: req?.user?._id });
  }
}

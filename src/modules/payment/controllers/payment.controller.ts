import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  CreatePaymentReqDto,
  ListPaymentsQueryParamsDto,
  UpdatePaymentStatusReqDto,
} from '../dto';
import { PaymentService } from '../services/payment.service';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('payment')
@ApiTags('Payment')
// @ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: ResponseDto })
  async create(@Body() createPaymentDto: CreatePaymentReqDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  // @Patch('payment-status')
  // @HttpCode(HttpStatus.OK)
  // async processCallback(@Query() query: UpdatePaymentStatusReqDto) {
  //   return await this.paymentService.updatePaymentStatus(query);
  // }

  // @Auth()
  @Get('list')
  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({ type: ResponseDto })
  async listPayments(
    // @Req() req: any,
    @Query() query: ListPaymentsQueryParamsDto,
  ) {
    return await this.paymentService.listPayments(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async fetchPayment(@Param('id') id: string) {
    return await this.paymentService.fetchPayment(id);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { PaymentOption } from '@shared/constants';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionReqDto {
  @ApiProperty({ example: '' })
  @IsMongoId()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: PaymentOption.VISA })
  @IsEnum(PaymentOption)
  @IsNotEmpty()
  paymentOption: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

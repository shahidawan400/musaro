import { ApiProperty } from '@nestjs/swagger';
import { PaymentOption, WorkshopStatus } from '@shared/constants';
import { PaginationDto } from '@shared/dto';
import { MediaObject } from '@shared/interfaces';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiMultipleFiles } from 'src/decorators';
import { WorkshopState } from './workshop.enum';

class WorkshopLocation {
  // @ApiProperty({ type: String, example: '', required: true })
  // @IsString()
  // @IsNotEmpty()
  // address: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsString()
  @IsNotEmpty()
  longitude: string;
}

export class CreateWorkshopReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ type: String, example: PaymentOption.VISA, required: true })
  @IsEnum(PaymentOption)
  @IsNotEmpty()
  paymentOption: string;

  @ApiProperty({ type: String, example: 'Workshop name', required: true })
  @IsString()
  @IsNotEmpty()
  workshopName: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, example: '2024-05-01', required: true })
  @IsISO8601()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ type: String, example: '2024-05-15', required: true })
  @IsISO8601()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ type: String, example: '09:00 AM', required: true })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ type: String, example: '05:00 PM', required: true })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ type: String, example: '100', required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pricePerPerson: number;

  @ApiProperty({ type: Number, example: 50, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  maxPeople: number;

  @ApiProperty({
    type: String,
    example: 'workshop description',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: WorkshopLocation, required: true })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  location: WorkshopLocation;

  @ApiMultipleFiles({ required: true })
  media: Array<MediaObject>;
}

export class WorkshopIdDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  workshopId: string;
}

export class UpdateWorkshopReqDto {
  @ApiProperty({ type: String, example: WorkshopState.CLOSED, required: true })
  @IsNotEmpty()
  @IsEnum(WorkshopState)
  workshopStatus: string;
}

export class ListWorkshopReqDto extends PaginationDto {
  @ApiProperty({ type: String, example: '', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}

export class PurchaseTicketReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  workshopId: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ type: String, example: PaymentOption.VISA, required: true })
  @IsEnum(PaymentOption)
  @IsNotEmpty()
  paymentOption: string;

  @ApiProperty({ type: Number, example: 2, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}

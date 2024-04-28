import {
  IsOptional,
  IsString,
  IsISO8601,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SourceDto {
  @ApiProperty({ type: String, example: 'creditcard' })
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: String, example: '4111111111111111' })
  @IsString()
  @IsNotEmpty()
  readonly number: string;

  @ApiProperty({ type: String, example: '25' })
  @IsString()
  @IsNotEmpty()
  readonly year: string;

  @ApiProperty({ type: String, example: '12' })
  @IsString()
  @IsNotEmpty()
  readonly month: string;

  @ApiProperty({ type: String, example: '123' })
  @IsString()
  @IsNotEmpty()
  readonly cvc: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly '3ds'?: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly manual?: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly save_card?: boolean;
}

export class CreatePaymentReqDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly amount: number;

  @ApiProperty({ type: String, example: 'SAR' })
  @IsString()
  @IsOptional()
  readonly currency?: string;

  @ApiProperty({ type: String, example: 'Payment for order #1234' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ type: String, example: 'https://example.com/orders' })
  @IsString()
  @IsNotEmpty()
  readonly callback_url: string;

  @ApiProperty({ type: SourceDto })
  @ValidateNested()
  @Type(() => SourceDto)
  readonly source: SourceDto;

  @ApiProperty({ type: Object, example: { key1: 'value1', key2: 'value2' } })
  @IsOptional()
  readonly metadata?: Record<string, any>;
}

export class UpdatePaymentStatusReqDto {
  @ApiProperty({
    example: '79cced57-9deb-4c4b-8f48-59c124f79688',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Succeeded', required: true })
  @IsString()
  @IsNotEmpty()
  message: string;
}

class DateRange {
  @ApiProperty({
    type: String,
    example: '2022-02-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  gt?: string;

  @ApiProperty({
    type: String,
    example: '2022-02-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  lt?: string;
}

class Metadata {
  @ApiProperty({ type: String, example: 'your-key', required: false })
  @IsOptional()
  @IsString()
  YOUR_KEY?: string;
}

export class ListPaymentsQueryParamsDto {
  @ApiProperty({ example: 'example-id', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'example-source', required: false })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: 'example-status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '1234', required: false })
  @IsOptional()
  @IsString()
  card_last_digits?: string;

  //   @ApiProperty({ type: DateRange, required: false })
  //   @IsOptional()
  //   @IsObject()
  //   @ValidateNested()
  //   @Type(() => DateRange)
  //   created?: DateRange;

  //   @ApiProperty({ type: Metadata, required: false })
  //   @IsOptional()
  //   @IsObject()
  //   @ValidateNested()
  //   @Type(() => Metadata)
  //   metadata?: Metadata;

  //   @ApiProperty({ type: DateRange, required: false })
  //   @IsOptional()
  //   @IsObject()
  //   @ValidateNested()
  //   @Type(() => DateRange)
  //   updated?: DateRange;

  @ApiProperty({ example: 'example-receipt', required: false })
  @IsOptional()
  @IsString()
  receipt_no?: string;

  @ApiProperty({ example: 'example-authorize', required: false })
  @IsOptional()
  @IsString()
  authorize_id?: string;
}

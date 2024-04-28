import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { SubscriptionPlanType, SubscriptionType } from '@shared/constants';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionPlanReqDto {
  @ApiProperty({
    type: String,
    example: SubscriptionPlanType.PROVIDER,
    required: true,
  })
  @IsEnum(SubscriptionPlanType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: String,
    example: SubscriptionType.MONTHLY,
    required: true,
  })
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  plan: string;

  @ApiProperty({ type: Number, example: 100, required: true })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ type: Number, example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  discount?: number;

  @ApiProperty({
    type: Array<String>,
    example: ['feature 1', 'feature 2'],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  features: string[];
}

export class SubscriptionPlanReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  planId: string;
}

export class SubscriptionPlanFilterReqDto {
  @ApiProperty({ type: Boolean, example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ obj, key }) => obj[key] === 'true')
  isActive?: boolean;
}

export class GetSubscriptionPlanReqDto extends SubscriptionPlanFilterReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  planId: string;
}

export class ListSubscriptionPlanReqDto extends SubscriptionPlanFilterReqDto {
  @ApiProperty({
    type: String,
    example: SubscriptionPlanType.PROVIDER,
    required: true,
  })
  @IsEnum(SubscriptionPlanType)
  @IsNotEmpty()
  type: string;
}

export class UpdateSubscriptionPlanReqDto extends PartialType(
  OmitType(CreateSubscriptionPlanReqDto, ['plan']),
) {
  @ApiProperty({ type: Boolean, example: true, required: false })
  @IsBooleanString()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (value == 'true') return true;
    else return false;
  })
  isActive: boolean;
}

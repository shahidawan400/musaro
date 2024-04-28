import {
  IsNotEmpty,
  IsEnum,
  IsMongoId,
  ValidateIf,
  IsInt,
  Min,
  Max,
  IsISO8601,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateRangeOption, ReviewType } from '@shared/constants';
import { PaginationDto } from '@shared/dto';

export class CreateReviewDto {
  @ApiProperty({
    example: '65e321eb51c43fec6ac67897',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly providerId: string;

  @ApiProperty({
    example: '65e321eb51c43fec6ac67897',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({
    example: ReviewType.PUBLIC,
    required: true,
  })
  @IsEnum(ReviewType)
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly overallExperience: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly responseTime: number;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @ValidateIf((o) => o.type === ReviewType.PUBLIC)
  @IsNotEmpty()
  readonly comment: string;

  @ApiProperty({
    example: 1,
  })
  @ValidateIf((o) => o.type === ReviewType.PRIVATE)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({
    example: 1,
  })
  @ValidateIf((o) => o.type === ReviewType.PRIVATE)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly quantity: number;

  @ApiProperty({
    example: 1,
  })
  @ValidateIf((o) => o.type === ReviewType.PRIVATE)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly commitment: number;
}

export class statisticsReqDto {
  @ApiProperty({
    example: DateRangeOption.THIS_MONTH,
    required: true,
  })
  @IsEnum(DateRangeOption)
  @IsNotEmpty()
  readonly option: DateRangeOption;

  @ApiProperty({
    example: '2024-03-01T00:00:00.000Z',
    required: false,
  })
  @ValidateIf((o) => o.option === DateRangeOption.CUSTOM_RANGE)
  @IsNotEmpty()
  @IsISO8601()
  readonly startDate?: string;

  @ApiProperty({
    example: '2024-03-01T00:00:00.000Z',
    required: false,
  })
  @ValidateIf((o) => o.option === DateRangeOption.CUSTOM_RANGE)
  @IsNotEmpty()
  @IsISO8601()
  readonly endDate?: string;
}

export class ListReviewReqDto extends PaginationDto {
  @ApiProperty({
    example: '65e321eb51c43fec6ac67897',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({
    example: '65e321eb51c43fec6ac67897',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly providerId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, RFQStatus } from '@shared/constants';
import { PaginationDto } from '@shared/dto';
import { MediaObject } from '@shared/interfaces';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

export class CreateJobReqDto {
  @ApiProperty({ type: String, example: 'title', required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, example: 'description', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, example: 'city', required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, example: '123456789', required: true })
  @IsString()
  @IsNotEmpty()
  projectOwnerMobile: string;

  @ApiProperty({ type: String, example: '123456789', required: true })
  @IsString()
  @IsNotEmpty()
  projectOwnerWhatsapp: string;

  // @ApiProperty({ type: Array, example: [''], required: true })
  // @IsArray()
  // @IsNotEmpty()
  // media: string[];

  @ApiMultipleFiles({ required: true })
  media: Array<MediaObject>;
}

export class UpdateJobReqDto {
  @ApiProperty({ type: Boolean, example: false, required: true })
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isVisible: boolean;
}

export class GetJobReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  jobId: string;
}

export class ListJobsReqDto extends PaginationDto {
  // @ApiProperty({ type: String, example: '', required: true })
  // @IsMongoId()
  // @IsNotEmpty()
  // userId: string;
}

export class JobAvailabilityDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsISO8601()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ type: String, example: '', required: true })
  @IsISO8601()
  @IsNotEmpty()
  endDate: string;
}

export class SendRFQReqDto {
  @ApiProperty({ type: String, example: 'xxxxxxxxxxxxxx', required: true })
  @IsMongoId()
  @IsNotEmpty()
  professionId: string;

  @ApiProperty({ type: String, example: 'city', required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, example: 'address', required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: String, example: 'scope of work', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: JobAvailabilityDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  availability?: JobAvailabilityDto;

  @ApiProperty({ type: [Number], example: [''], required: false })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((e) => +e.trim())
      : [value],
  )
  @IsArray()
  rating?: number[];

  @ApiProperty({
    example: ProviderType.INDIVIDUAL,
    enum: ProviderType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProviderType)
  providerType: string;

  @ApiMultipleFiles({ required: true })
  media: Array<MediaObject>;
}

export class GetRFQReqDto {
  @ApiProperty({ type: String, example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  rfqId: string;
}

export class RespondRFQReqDto {
  @ApiProperty({ type: String, example: RFQStatus.APPROVED, required: true })
  @IsEnum(RFQStatus)
  @IsNotEmpty()
  status: string;
}

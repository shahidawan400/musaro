import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AppLanguage } from '@shared/constants';
import { PaginationDto } from '@shared/dto';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiSingleFile } from 'src/decorators';

export class UpdateAppLanguageReqDto {
  @ApiProperty({ example: AppLanguage.ENGLISH })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  appLanguage: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { FavouriteType } from '@shared/constants';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFavouriteReqDto {
  @ApiProperty({ example: '65d681d84c1b9832184519cb', required: true })
  @IsMongoId()
  @IsNotEmpty()
  favouriteTo: string;

  @ApiProperty({ example: FavouriteType.PROFILE, required: true })
  @IsEnum(FavouriteType)
  @IsNotEmpty()
  type: string;
}

export class ListFavouriteReqDto {
  @ApiProperty({ example: '', required: false })
  @IsEnum(FavouriteType)
  @IsOptional()
  type: string;
}

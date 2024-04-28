import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "@shared/dto";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class AddCityReqDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CityIdReqDto {
  @ApiProperty({ example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  cityId: string;
}

export class ListCitiesReqDto extends PartialType(PaginationDto) {}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateCustomerProfileReqDto {
  @ApiProperty({ type: String, example: '' })
  @IsString()
  @ValidateIf((dto) => !dto.username && !dto.city)
  @IsNotEmpty()
  name: string;

  // @ApiProperty({ type: String, example: '' })
  // @IsString()
  // @ValidateIf((dto) => !dto.name && !dto.city)
  // @IsNotEmpty()
  // username: string;

  @ApiProperty({ type: String, example: '' })
  @IsString()
  @ValidateIf((dto) => !dto.name && !dto.username)
  @IsNotEmpty()
  city: string;
}

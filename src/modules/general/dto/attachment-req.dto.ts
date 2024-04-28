import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiSingleFile } from 'src/decorators';

export class CreateAttachmentReqDto {
  @ApiProperty({ type: String, example: '', required: false })
  @IsString()
  @IsOptional()
  module: string;

  @ApiSingleFile({ required: true })
  attachment: any;
}

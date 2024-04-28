import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class UpdateAppLanguageResDto extends ApiResponseDto {
  @ApiProperty({ example: 'App Language Updated!' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

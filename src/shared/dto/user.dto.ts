import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ example: '65c0206ac4f42c21f12e1bbb', required: true })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}

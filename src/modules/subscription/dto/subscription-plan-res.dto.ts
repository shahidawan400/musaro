import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CreateSubscriptionPlanResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Subscription Plan Created' })
  message: string;
}

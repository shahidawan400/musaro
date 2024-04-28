import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CreateReviewResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Review has been saved' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

export class ListReviewsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Review list' })
  message: string;

  @ApiProperty({
    example: {
      reviews: [
        {
          jobId: 'string',
          providerId: 'string',
          type: 'string',
          userId: 'string',
          comment: 'string',
          createdAt: 'string',
          userName: 'string',
          ratings: {
            overallExperience: 1,
            responseTime: 1,
            price: 1,
            quantity: 1,
            commitment: 1,
          },
        },
      ],
      meta: {
        page: 0,
        pages: 0,
        limit: 0,
        total: 0,
      },
    },
  })
  data: object;
}

export class StatisticsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Review statistics' })
  message: string;

  @ApiProperty({
    example: {
      avgRating: 0,
      avgResponseTime: 0,
    },
  })
  data: object;
}

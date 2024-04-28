import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CreateProfessionResDto extends ApiResponseDto {
  @ApiProperty({ example: 'New Profession Added!' })
  message: string;

  @ApiProperty({
    example: {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      name: 'profession name',
      description: 'profession description',
      img: 'profession/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg',
      status: 'ACTIVE',
      createdAt: '2024-03-17T10:43:10.737Z',
      updatedAt: '2024-03-17T10:43:10.737Z',
    },
  })
  data: any;
}

export class ProfessionResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      name: 'profession name',
      description: 'profession description',
      img: 'profession/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg',
      status: 'ACTIVE',
      createdAt: '2024-03-17T10:43:10.737Z',
      updatedAt: '2024-03-17T10:43:10.737Z',
    },
  })
  data: any;
}

export class ListProfessionResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      professions: [
        {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          name: 'profession name',
          description: 'profession description',
          img: 'profession/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg',
          status: 'ACTIVE',
          createdAt: '2024-03-17T10:43:10.737Z',
          updatedAt: '2024-03-17T10:43:10.737Z',
        },
      ],
      meta: {
        page: 1,
        pages: 1,
        limit: 10,
        total: 1,
      },
    },
  })
  data: any;
}
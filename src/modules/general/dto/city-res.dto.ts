import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CityResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      name: 'city name',
    },
  })
  data: any;
}

export class ListCityResDto extends ApiResponseDto {
  @ApiProperty({
    example: [
      {
        _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        name: 'city name',
      },
    ],
  })
  data: any;
}

export class DeleteCityResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'Deleted!',
  })
  message: any;

  @ApiProperty({
    example: null,
  })
  data: any;
}

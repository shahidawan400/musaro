import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CreateJobResDto extends ApiResponseDto {}

export class DeleteJobRequestResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Request Sent!' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

export class SendRFQResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Request Sent!' })
  message: string;

  @ApiProperty({ example: {} })
  data: any;
}

export class ListUserRFQsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'RFQs' })
  message: string;

  @ApiProperty({
    example: [
      {
        _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        status: 'PENDING',
        jobRequest: {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          city: 'Riyadh',
          address: 'address',
          description: 'scope of work',
          media: [
            'rfqs/xxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
          ],
          userDetail: {
            name: 'name',
            mobile: '03123636736',
            role: 'CUSTOMER',
            username: 'username',
            city: 'city',
          },
          professionDetail: {
            _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
            name: 'Electrician',
            description: 'description about profession electrician',
          },
        },
      },
    ],
  })
  data: any;
}

export class GetRFQResDto extends ApiResponseDto {
  @ApiProperty({ example: 'RFQ' })
  message: string;

  @ApiProperty({
    example: {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      userId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      status: 'PENDING',
      jobRequest: {
        _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        city: 'Riyadh',
        address: 'address',
        description: 'scope of work',
        media: [
          'rfqs/xxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
        ],
        userDetail: {
          name: 'name',
          mobile: '03123636736',
          role: 'CUSTOMER',
          username: 'username',
          city: 'city',
        },
        professionDetail: {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          name: 'Electrician',
          description: 'description about profession electrician',
        },
      },
    },
  })
  data: any;
}

export class RespondRFQResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Status Updated!' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

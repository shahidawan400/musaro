import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class GetProviderProfileResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      _id: '65cab57d047f7ea9601da3a3',
      name: 'provider abc',
      mobile: '03123456780',
      role: 'PROVIDER',
      username: 'provider01',
      city: 'city',
      appLanguage: 'ENGLISH',
      isVerified: true,
      isActive: true,
      isApproved: true,
      reason: '',
      createdAt: '2024-02-13T00:19:09.757Z',
      updatedAt: '2024-02-13T21:31:15.324Z',
      serviceDetail: {
        type: 'individual',
        service: 'Electrician',
        serviceDescription: 'Senior Electrician',
        yearsOfExperience: '10',
        idNumber: 'ABC123',
        idPicture: 'https://abc.com/xyz.jpg',
        whatsapp: '03123456788',
        officeNumber: '090078601',
      },
    },
  })
  data: object;

  @ApiProperty({ example: 'Provider Profile Data' })
  message: string;
}

export class ListProvidersResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      users: [
        {
          _id: '65d681d84c1b9832184519cb',
          name: 'provider 02',
          mobile: '03123456711',
          username: 'provider02',
          city: 'city',
          serviceDetail: {
            type: 'INDIVIDUAL',
            serviceDescription: 'Sr. Plumber',
            yearsOfExperience: '11',
            whatsapp: '3123456789',
            officeNumber: '90078601',
          },
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
  data: object;

  @ApiProperty({ example: 'List of Providers' })
  message: string;
}

export class UpdateProviderProfileResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      type: 'individual',
      service: 'Electrician',
      serviceDescription: 'Senior Electrician',
      yearsOfExperience: '10',
      idNumber: 'ABC123',
      idPicture: 'https://abc.com/xyz.jpg',
      whatsapp: '03123456788',
      officeNumber: '090078601',
    },
  })
  data: object;

  @ApiProperty({ example: 'Provider Profile Updated' })
  message: string;
}

export class ProviderAvailabilityResDto extends ApiResponseDto {
  @ApiProperty({
    example: null,
  })
  data: object;

  @ApiProperty({ example: 'Provider Availability Updated' })
  message: string;
}

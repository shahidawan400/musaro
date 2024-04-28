import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class GetCustomerDetailResDto extends ApiResponseDto {
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
  data: string;
}

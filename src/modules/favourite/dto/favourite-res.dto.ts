import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CreateFavouriteResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Added into favourite' })
  message: string;
}

export class GetUserFavouriteResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Favourites' })
  message: string;

  @ApiProperty({
    example: [
      {
        _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        favouriteBy: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        favouriteTo: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'PROFILE',
        createdAt: '2024-03-30T21:29:46.244Z',
        updatedAt: '2024-03-30T21:29:46.244Z',
        userDetails: {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          name: 'name',
          mobile: '00000000000',
          role: 'PROVIDER',
          username: 'username',
          city: 'city',
          avgRating: 0,
          avgResponseTime: 0,
          serviceDetail: {
            type: 'TYPE',
            professionId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
            businessName: 'business name',
            serviceDescription: 'description',
            yearsOfExperience: '0',
            idNumber: 'idNumber',
            idPicture:
              'users/xxxxxxxxxxxxxxxxxxxxxxxx/identity/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
            whatsapp: '00000000000',
            unAvailable: false,
            isLocationLimited: false,
            limitedCities: [],
          },
        },
      },
      {
        _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        favouriteBy: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        favouriteTo: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'WORKSHOP',
        createdAt: '2024-03-30T22:48:18.255Z',
        updatedAt: '2024-03-30T22:48:18.255Z',
        workshopDetails: {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          workshopName: 'Workshop Name',
          city: 'city',
          startDate: '2024-05-01T00:00:00.000Z',
          endDate: '2024-05-15T00:00:00.000Z',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          pricePerPerson: '100',
          maxPeople: 50,
          description: 'workshop description',
          location: {
            longitude: '46.738586',
            latitude: '24.774265',
          },
          media: [
            'workshops/xxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
          ],
          status: 'OPEN',
          isApproved: true,
          createdBy: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          remainingSeats: 50,
          createdAt: '2024-03-26T16:53:19.456Z',
          updatedAt: '2024-03-27T16:16:37.553Z',
        },
      },
    ],
  })
  data: any;
}

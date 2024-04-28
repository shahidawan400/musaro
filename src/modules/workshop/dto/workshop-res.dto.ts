import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class WorkshopResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      workshopName: 'Workshop name',
      city: 'city name',
      startDate: '2024-05-01T00:00:00.000Z',
      endDate: '2024-05-15T00:00:00.000Z',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      pricePerPerson: 100,
      maxPeople: 50,
      description: 'workshop description',
      location: {
        longitude: '46.738586',
        latitude: '24.774265',
      },
      media: [
        'workshops/xxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg',
      ],
      status: 'CLOSED',
      isApproved: false,
      createdBy: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      remainingSeats: 50,
      createdAt: '2024-03-20T18:52:03.390Z',
      updatedAt: '2024-03-20T18:52:03.390Z',
    },
  })
  data: any;
}

export class ListWorkshopResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      workshops: [
        {
          _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          workshopName: 'Workshop name',
          city: 'city name',
          startDate: '2024-05-01T00:00:00.000Z',
          endDate: '2024-05-15T00:00:00.000Z',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          pricePerPerson: 100,
          maxPeople: 50,
          description: 'workshop description',
          location: {
            longitude: '46.738586',
            latitude: '24.774265',
          },
          media: [
            'workshops/xxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg',
          ],
          status: 'CLOSED',
          isApproved: false,
          createdBy: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          remainingSeats: 50,
          createdAt: '2024-03-20T18:52:03.390Z',
          updatedAt: '2024-03-20T18:52:03.390Z',
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

export class PurchaseTicketResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Tickets Booked!' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}
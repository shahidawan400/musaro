import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class SaveTokenResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Token has been saved' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

export class SettingsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Setting has been updated' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

export class StatusResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Notification has been read' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}
export class ListNotificationsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Notification List' })
  message: string;

  @ApiProperty({
    example: {
      notifications: [
        {
          _id: 'string',
          notificationType: 'string',
          senderId: 'string',
          recipient: {
            id: 'string',
            isRead: true,
          },
          message: 'string',
          data: 'string',
          createdAt: 'string',
          updatedAt: 'string',
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
export class GetNotificationsResDto extends ApiResponseDto {
  @ApiProperty({ example: 'Notification Data' })
  message: string;

  @ApiProperty({ example: {} })
  data: object;
}

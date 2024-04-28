import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayNotEmpty,
  IsObject,
  IsOptional,
  IsMongoId,
  IsBoolean,
  ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@shared/constants';
import { PaginationDto } from '@shared/dto';


export class SaveTokenReqDto {

  @ApiProperty({
    example: '79cced57-9deb-4c4b-8f48-59c124f79688',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly fcmToken: string;
}

export class SettingsReqDto {

  @ApiProperty({
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isNotificationOn: boolean;
}

export class sendNoificationReqDto {

  @ApiProperty({ example: NotificationType.REQUEST })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  notificationType: string;

  // @ApiProperty({
  //   example: '65d6f9444ea435e4e352a1a8',
  //   required: true,
  // })
  // @IsMongoId()
  // @IsNotEmpty()
  // senderId: string;

  @ApiProperty({
    example: ['65d6f9444ea435e4e352a1a8'],
    required: true,
  })
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  recipientsId: string[];

  @ApiProperty({
    example: 'Title for Request',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Message for Request',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    example: {},
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: object;
}

export class ListNotificationsReqDto extends PaginationDto {
  @ApiProperty({ example: NotificationType.REQUEST, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: string;
}

export class NotificationQueryReqDto {
  @ApiProperty({ example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  notificationId: string;
}

export class ChangeStatusReqDto {
  @ApiProperty({ example: '', required: true })
  @IsMongoId()
  @IsNotEmpty()
  notificationId: string;
}


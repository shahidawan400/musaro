import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dto';

export class CheckUserNameResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'Username available',
  })
  message: string;
}
export class SignUpResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'OTP is sent!',
  })
  message: string;

  @ApiProperty({
    example: {
      _id: '65c01a36e72d093778fcc7dd',
      name: 'full_name',
      mobile: '123456789',
      role: 'Customer',
      username: 'user_name',
      city: 'city_name',
      metadata: {
        appLanguage: 'ENGLISH',
        isVerified: false,
        isProfileCompleted: false,
        isActive: true,
        isApproved: false,
        reason: 'admin approval pending',
        isNotificationOn: true,
      },
      createdAt: '2024-02-04T23:13:58.040Z',
      updatedAt: '2024-02-04T23:13:58.040Z',
    },
  })
  data: any;
}

export class LoginResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'User LoggedIn',
  })
  message: string;

  @ApiProperty({
    example: {
      accessToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      user: {
        _id: '65c40c36769c1259220f5e93',
        name: 'name',
        mobile: '03123456788',
        role: 'Customer',
        username: 'username',
        city: 'city',
        metadata: {
          appLanguage: 'ENGLISH',
          otp: null,
          isVerified: true,
          isProfileCompleted: false,
          isActive: true,
          isApproved: false,
          reason: 'admin approval pending',
          isNotificationOn: true,
        },
        createdAt: '2024-02-07T23:03:18.458Z',
        updatedAt: '2024-02-07T23:21:05.544Z',
      },
    },
  })
  data: any;
}

export class OtpResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'OTP is sent!',
  })
  message: string;
}

export class VerifyOtpResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'OTP is verified!',
  })
  message: string;
}

export class ChangePasswordResDto extends ApiResponseDto {
  @ApiProperty({
    example: 'Password updated!',
  })
  message: string;
}

export class UserResDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      _id: '65c01a36e72d093778fcc7dd',
      name: 'full_name',
      mobile: '123456789',
      role: 'Customer',
      username: 'user_name',
      city: 'city_name',
      isActive: false,
      reason: 'Pending Approval',
      createdAt: '2024-02-04T23:13:58.040Z',
      updatedAt: '2024-02-04T23:13:58.040Z',
    },
  })
  data: any;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  VerifyOtpReqDto,
  SignUpReqDto,
  UserNameReqDto,
  LoginReqDto,
  ForgotPasswordReqDto,
  ChangePasswordReqDto,
  ResetPasswordReqDto,
  ResendOtpReqDto,
} from './dto/auth-req.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChangePasswordResDto,
  CheckUserNameResDto,
  LoginResDto,
  OtpResDto,
  SignUpResDto,
  VerifyOtpResDto,
} from './dto/auth-res.dto';
import { UserIdDto } from '@shared/dto';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user-name/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CheckUserNameResDto })
  async checkUserName(@Param() payload: UserNameReqDto) {
    return await this.authService.checkUserName(payload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SignUpResDto })
  async signup(@Body() payload: SignUpReqDto) {
    return await this.authService.signup(payload);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResDto })
  async login(@Body() payload: LoginReqDto) {
    return await this.authService.login(payload);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OtpResDto })
  async resendOtp(@Body() payload: ResendOtpReqDto) {
    return await this.authService.resendOtp(payload);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VerifyOtpResDto })
  async verifyOtp(@Body() payload: VerifyOtpReqDto) {
    return await this.authService.verifyOtp(payload);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OtpResDto })
  async forgotPassword(@Body() payload: ForgotPasswordReqDto) {
    return await this.authService.forgotPassword(payload);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChangePasswordResDto })
  async changePassword(@Body() payload: ChangePasswordReqDto) {
    return await this.authService.changePassword(payload);
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChangePasswordResDto })
  async resetPassword(@Req() req: any, @Body() payload: ResetPasswordReqDto) {
    const userId = req?.user?._id;
    return await this.authService.resetPassword({ userId, ...payload });
  }
}

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser, User, UserRepository } from '../user';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage, UserRole } from '@shared/constants';
import { Hash, generateOtpWithExpiry } from '@shared/utils';
import { IOTP } from '@shared/interfaces';
import {
  IAuthService,
  IChangePassword,
  IForgotPassword,
  ILogin,
  IResetPassword,
  ISignup,
  IVerifyOtp,
  IVerifyToken,
} from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async checkUserName(payload: { username: string }) {
    try {
      let { username } = payload;
      const userNameExists = await this.userRepository.findOne(
        {
          username,
        },
        { username: 1 },
        { notFoundThrowError: false },
      );
      if (userNameExists)
        throw new ConflictException(ResponseMessage.USERNAME_ALREADY_EXISTS);

      return null;
    } catch (error) {
      throw error;
    }
  }

  async signup(payload: ISignup) {
    try {
      const { username, mobile, password, role, appLanguage, ...restPayload } =
        payload;

      // Check if username or mobile already exists
      const existingUser = await this.userRepository.findOne(
        {
          $or: [{ username }, { mobile }],
        },
        { username: 1, mobile: 1 },
        { notFoundThrowError: false },
      );

      if (existingUser)
        throw new ConflictException(
          existingUser.username === username
            ? ResponseMessage.USERNAME_ALREADY_EXISTS
            : ResponseMessage.MOBILE_ALREADY_EXISTS,
        );

      // Hash password and generate OTP asynchronously in parallel
      const [hashedPassword, otp] = await Promise.all([
        Hash.make(password),
        generateOtpWithExpiry(),
      ]);

      const userData: User = {
        ...restPayload,
        mobile,
        username,
        password: hashedPassword,
        role,
        metadata: { otp },
      };
      if (appLanguage) userData.metadata.appLanguage = appLanguage;
      if (role === UserRole.PROVIDER)
        userData.metadata.isProfileCompleted = false;

      // Create user
      const newUser = await this.userRepository.create(userData);

      // Omit sensitive fields from response
      const {
        password: _,
        // metadata: { otp: __, ...metadata }, // temporarily added for F.E testing
        ...response
      } = newUser;
      return {
        ...response,
        // metadata
      };
    } catch (error) {
      throw error;
    }
  }

  async login(payload: ILogin) {
    try {
      const { username, password } = payload;
      const user = await this.userRepository.findOne(
        { username },
        {},
        { notFoundThrowError: false },
      );

      if (!user || !(await Hash.compare(password, user?.password))) {
        throw new BadRequestException(
          ResponseMessage.INVALID_USERNAME_OR_PASSWORD,
        );
      }

      const { metadata } = user;
      if (!metadata || !metadata.isActive) {
        throw new ForbiddenException(ResponseMessage.NON_ACTIVE_ACCOUNT);
      }

      if (!metadata.isVerified) {
        const { mobile } = user;
        await this.resendOtp({ mobile });
        throw new ForbiddenException(ResponseMessage.NON_VERIFIED_ACCOUNT);
      }

      // Omit sensitive fields from user object
      delete user.password;

      return {
        accessToken: this.jwtService.sign({
          username: user.username,
          sub: user._id,
        }),
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(payload: { mobile: string }) {
    try {
      const { mobile } = payload;
      const otp: IOTP = generateOtpWithExpiry();
      await this.userRepository.findOneAndUpdate(
        {
          mobile,
        },
        {
          $set: {
            'metadata.otp': otp,
            'metadata.isVerified': false,
          },
        },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(payload: IVerifyOtp) {
    try {
      const { mobile, otpCode } = payload;
      const response = await this.userRepository.findOneAndUpdate(
        {
          mobile: mobile,
          'metadata.otp.code': otpCode,
          'metadata.otp.expiresAt': { $gt: new Date() }, // Check if the OTP is not expired
        },
        {
          $set: {
            'metadata.otp': null,
            'metadata.isVerified': true,
          },
        },
        { notFoundThrowError: false },
      );
      if (!response) throw new BadRequestException(ResponseMessage.INVALID_OTP);
      return null;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(payload: IVerifyToken) {
    try {
      const { token } = payload;
      const decoded = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET_KEY'),
      });
      if (!decoded || !decoded?.sub)
        throw new UnauthorizedException(ResponseMessage.INVALID_TOKEN);

      const user = await this.userRepository.findOne({
        username: decoded?.username,
        'metadata.isActive': true,
      });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(payload: IForgotPassword) {
    try {
      const { mobile } = payload;
      const user = await this.userRepository.findOne(
        { mobile, 'metadata.isActive': true },
        { _id: 1, mobile: 1 },
      );
      const otp = generateOtpWithExpiry();

      // TODO: Send OTP to user's mobile
      await this.userRepository.findOneAndUpdate(
        { _id: user?._id },
        { $set: { 'metadata.otp': otp } },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(payload: IChangePassword) {
    try {
      const { mobile, password } = payload;
      const hashedPassword = await Hash.make(password);
      await this.userRepository.findOneAndUpdate(
        { mobile, 'metadata.isActive': true },
        { $set: { password: hashedPassword } },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(payload: IResetPassword) {
    try {
      const { userId, oldPassword, newPassword } = payload;
      const user = await this.userRepository.findOne(
        { _id: userId, 'metadata.isActive': true },
        { password: 1 },
        { notFoundThrowError: false },
      );
      if (!user || !(await Hash.compare(oldPassword, user?.password))) {
        throw new BadRequestException(ResponseMessage.INVALID_LOGIN_PASSWORD);
      }

      // TODO: For security purpose: Send OTP

      const hashedPassword = await Hash.make(newPassword);
      await this.userRepository.findOneAndUpdate(
        { _id: userId },
        { $set: { password: hashedPassword } },
      );
      return null;
    } catch (error) {
      throw error;
    }
  }
}

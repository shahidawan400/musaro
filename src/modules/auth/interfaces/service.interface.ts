import { IUser } from "src/modules/user/interfaces";
import { IChangePassword, IForgotPassword, ILogin, IResetPassword, ISignup, IVerifyOtp, IVerifyToken } from "./auth.interface";

export interface IAuthService {
  checkUserName(payload: { username: string }): Promise<void>;
  signup(payload: ISignup): Promise<Omit<IUser, 'password' | 'otp'>>;
  login(payload: ILogin): Promise<{ accessToken: string; user: IUser }>;
  resendOtp(payload: { mobile: string }): Promise<void>;
  verifyOtp(payload: IVerifyOtp): Promise<void>;
  verifyToken(payload: IVerifyToken): Promise<Omit<IUser, 'password'>>;
  forgotPassword(payload: IForgotPassword): Promise<void>;
  changePassword(payload: IChangePassword): Promise<void>;
  resetPassword(payload: IResetPassword): Promise<void>;
}
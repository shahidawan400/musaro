export interface ILogin {
  username: string;
  password: string;
  // role: string;
}

export interface ISignup {
  role: string;
  mobile: string;
  username: string;
  password: string;
  name: string;
  city: string;
  appLanguage?: string;
}

export interface IVerifyOtp {
  mobile: string;
  otpCode: number;
}

export interface IForgotPassword {
  mobile: string;
}

export interface IChangePassword extends IForgotPassword {
  password: string;
}

export interface IResetPassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface IVerifyToken {
  token: string;
}

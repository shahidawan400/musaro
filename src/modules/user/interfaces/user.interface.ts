export interface IUser {
  role: string;
  mobile: string;
  username: string;
  password: string;
  name: string;
  city: string;
}

export interface IUpdateCustomerProfile {
  userId: string;
  name?: string;
  // username?: string;
  city?: string;
}

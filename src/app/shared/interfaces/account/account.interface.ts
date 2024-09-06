export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  adress?: string;
  uid?: string;
}

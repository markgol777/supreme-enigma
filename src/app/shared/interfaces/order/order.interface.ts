import { IUser } from "../account/account.interface";
import { IProductResponse } from "../product/product.interface";

export interface IOrderRequest {
  date: string;
  userId: string;
  user: IUser;
  delivery: string;
  products: IProductResponse[];
  sum: number;
  status: string;
}

export interface IOrderResponse extends IOrderRequest {
  id: string;
}

import { ICategoryResponse } from "../category/category.interface";

export interface IProductRequest {
  category: ICategoryResponse;
  name: string;
  path: string;
  imagePath: string;
  description: string;
  allergens: string;
  weight: string;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  price: number;
  count: number;
}

export interface IProductResponse extends IProductRequest {
  id: string;
}

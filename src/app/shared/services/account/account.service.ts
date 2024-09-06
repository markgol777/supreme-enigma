import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductResponse } from '../../interfaces/product/product.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public isUserLogin$ = new Subject<boolean>();
  public changeDelivery$ = new Subject<boolean>();
  public userFavorites: IProductResponse[] = [];

  constructor() { }

  initUserFavorites(): void {
    if(localStorage.getItem('tomatina_favorite')) {
      this.userFavorites = JSON.parse(localStorage.getItem('tomatina_favorite') as string);
    }
  }

  setFavorite(product: IProductResponse): void {
    const index = this.userFavorites.findIndex(prod => prod.id === product.id);
    if(index > -1) {
      this.userFavorites.splice(index, 1);
    } else {
      this.userFavorites.push(product);
    }
    localStorage.setItem('tomatina_favorite', JSON.stringify(this.userFavorites));
  }

}

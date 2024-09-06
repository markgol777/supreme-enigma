import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnDestroy {

  public userCategories!: ICategoryResponse[];
  public userProducts!: IProductResponse[];
  public navSelectIsOpen = false;
  public activePage = 'Салати';
  public eventSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService
  ) { 
    this.eventSubscription = router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loadProducts();
        }
      })
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadProducts(): void {
    let categoryName = this.activatedRoute.snapshot.paramMap.get('category') as string;
    if (!categoryName) {
      categoryName = 'salad'
    }
    this.productService.getAllByCategory(categoryName)
      .subscribe(data => {
        this.userProducts = data as IProductResponse[];
        this.activePage = this.userProducts[0].category.name;
      });
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .subscribe(data => {
        this.userCategories = data as ICategoryResponse[];
      });
  }

  toggleNavSelect(): void {
    this.navSelectIsOpen = !this.navSelectIsOpen;
  }

  closeNavSelect(page: string): void {
    this.navSelectIsOpen = false;
    this.activePage = page;
  }

  addToFavorite(product: IProductResponse): void {
    this.accountService.setFavorite(product);
  }

  isFavorite(id: string): boolean {
    return this.accountService.userFavorites.some(prod => prod.id === id);
  }

  fastOrder(product: IProductResponse): void {
    console.log('Швидке замовлення: ' + product.name);
  }

  changeCount(product: IProductResponse, plus: boolean): void {
    if(plus) {
      ++product.count;
    } else if (!plus && product.count > 1) {
      --product.count;
    }
  }

  addToBasket(product: IProductResponse): void {
    this.orderService.addToBasket(product);
    product.count = 1;
  }

  ngOnDestroy(): void {
      this.eventSubscription.unsubscribe();
  }

}

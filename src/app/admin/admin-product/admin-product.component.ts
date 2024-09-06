import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  public adminCategories!: ICategoryResponse[];
  public adminProducts!: IProductResponse[];
  public productForm!: FormGroup;
  private currentProductId!: string;
  public formIsOpen = false;
  public editStatus = false;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    public imageService: ImagesService
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    this.loadProducts();
    this.imageService.uploadPercent = 0;
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required],
      description: [null, Validators.required],
      allergens: [null, Validators.required],
      weight: [null, Validators.required],
      calories: [null, Validators.required],
      proteins: [null, Validators.required],
      fats: [null, Validators.required],
      carbohydrates: [null, Validators.required],
      price: [null, Validators.required],
      count: [1]
    })
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({ category: '' });
    })
  }
  
  loadProducts(): void {
    this.productService.getAll()
      .subscribe(data => {
      this.adminProducts = data as IProductResponse[];
    })
  }

  toggleOpenForm(): void {
    this.formIsOpen = !this.formIsOpen;
  }
  
  uploadImage(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/product', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
      .then(() => {
        this.productForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }

  saveProduct(): void {
    if(this.editStatus) {
      this.productService.update(this.productForm.value, this.currentProductId)
        .then(() => {
          this.loadProducts();
        })
    } else {
      this.productService.create(this.productForm.value)
        .then(() => {
          this.loadProducts();
        })
    }
    this.formIsOpen = false;
    this.editStatus = false;
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
    this.productForm.reset();
    this.productForm.patchValue({ category: '' });
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      imagePath: product.imagePath,
      description: product.description,
      allergens: product.allergens,
      weight: product.weight,
      calories: product.calories,
      proteins: product.proteins,
      fats: product.fats,
      carbohydrates: product.carbohydrates,
      price: product.price
    });
    this.currentProductId = product.id;
    this.editStatus = true;
    this.formIsOpen = true;
    this.isUploaded = true;

  }

  deleteProduct(product: IProductResponse): void {
    this.productService.delete(product.id)
      .then(() => {
        this.loadProducts();
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ImagesService } from 'src/app/shared/services/images/images.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public adminCategories!: ICategoryResponse[];
  public categoryForm!: FormGroup;
  private currentCategoryId!: string;
  public formIsOpen = false;
  public editStatus = false;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public imageService: ImagesService
  ) { }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
    this.imageService.uploadPercent = 0;
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    });
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .subscribe(data => {
        this.adminCategories = data as ICategoryResponse[];
      });
  }

  toggleOpenForm(): void {
    this.formIsOpen = !this.formIsOpen;
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/category', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
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
        this.categoryForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }

  saveCategory(): void {
    if(this.editStatus) {
      this.categoryService.update(this.categoryForm.value, this.currentCategoryId)
        .then(() => {
          this.loadCategories();
        })
    } else {
      this.categoryService.create(this.categoryForm.value)
        .then(() => {
          this.loadCategories();
        })
    }
    this.formIsOpen = false;
    this.editStatus = false;
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
    this.categoryForm.reset();
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.currentCategoryId = category.id;
    this.editStatus = true;
    this.formIsOpen = true;
    this.isUploaded = true;
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.delete(category.id)
      .then(() => {
        this.loadCategories();
      })
  }

}

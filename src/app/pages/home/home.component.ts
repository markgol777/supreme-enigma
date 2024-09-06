import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public detailsIsOpen = false;

  toggleDetails(): void {
    this.detailsIsOpen = !this.detailsIsOpen;
  }

}

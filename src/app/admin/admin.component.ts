import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/services/account/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  public navSelectIsOpen = false;
  public activePage = 'Замовлення';

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('tomatina_currentUser');
    this.accountService.isUserLogin$.next(true);
  }

  toggleNavSelect(): void {
    this.navSelectIsOpen = !this.navSelectIsOpen;
  }

  closeNavSelect(page: string): void {
    this.navSelectIsOpen = false;
    this.activePage = page;
  }

}

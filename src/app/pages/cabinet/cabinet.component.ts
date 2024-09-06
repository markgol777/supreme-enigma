import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent {

  public navSelectIsOpen = false;
  public activePage = 'Особисті дані';

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  toggleNavSelect(): void {
    this.navSelectIsOpen = !this.navSelectIsOpen;
  }

  closeNavSelect(page: string): void {
    this.navSelectIsOpen = false;
    this.activePage = page;
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('tomatina_currentUser');
    this.accountService.isUserLogin$.next(true);
  }

}

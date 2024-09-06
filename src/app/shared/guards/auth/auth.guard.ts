import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLE } from '../../constants/role.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
      if(currentUser && currentUser.role === ROLE.USER && route.path === 'cabinet') {
        return true;
      } else if(currentUser && currentUser.role === ROLE.ADMIN && route.path === 'admin') {
        return true;
      }
    return false;
  }
}

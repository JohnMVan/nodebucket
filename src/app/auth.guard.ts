//Title:  auth.guard.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 22 March 2023
//Description:  TypeScript file for the auth.guard component.

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const sessionUser = this.cookieService.get('session_user')

    if (sessionUser) {
      return true;
    } else {
      this.router.navigate(['/session/login'])
      return false;
    }
  }  
}


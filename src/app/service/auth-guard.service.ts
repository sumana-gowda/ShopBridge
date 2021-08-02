import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private _router:Router ) {
  }

  /**
   * Activate users iif authorizedUser value in sessionStorage is set to 1
   * @param route 
   * @param state 
   * @returns boolean value
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (sessionStorage.getItem('authorizedUser') == '1')  {
          return true;
      } 
      return false;
  }
}

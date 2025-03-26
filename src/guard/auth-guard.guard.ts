import { inject, Injectable } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync } from '@angular/router';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuardGuard: CanActivateFn = (route, state) => {
  return true;
};

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private jwtUtility = inject(JwtHelperService);
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const token = localStorage.getItem('jwt');
    
    // token is valid
    if (token && !this.jwtUtility.isTokenExpired(token)){
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
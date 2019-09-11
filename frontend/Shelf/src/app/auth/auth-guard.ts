import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authService.getIsAuth();
        if (isAuth === true) {
            return true;
        } else {
            // this.router.navigate(['/login']);
            return false;
        }
    }
}

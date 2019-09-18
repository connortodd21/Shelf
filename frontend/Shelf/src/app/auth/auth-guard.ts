import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const auth = this.loginService.getAuthenticationData();
        console.log(auth)
        console.log(new Date(auth.expirationDate) > new Date())
        if (auth && auth.token && (new Date(auth.expirationDate) > new Date())) {
            return true;
        } else {
            console.log('here')
            this.loginService.logoutUser().then( res => {
                this.loginService.logout();
            });
            this.router.navigate(['/login']);
            return false;
        }
    }
}

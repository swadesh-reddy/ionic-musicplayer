import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserauthService } from './userauth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: UserauthService, private router: Router) { }

    canActivate() {
        if (localStorage.getItem('token')) {
            return true;
        }
        else {
            this.router.navigate(['login']);
            return false;
        }
    }
}

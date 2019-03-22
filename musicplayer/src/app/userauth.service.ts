import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { User } from './user';
@Injectable({
    providedIn: 'root'
})
export class UserauthService {
    authToken: any;
    user: any
    token: any
    public url = "http://localhost:3000";
    private _headers = new HttpHeaders({
        "cache-control": 'no-cache',
    });
    constructor(private http: HttpClient) { }
    onRegister(userdetails) {
        return this.http.post(this.url+'/register', userdetails);
    }
    Login(data) {
        return this.http.post<User>(this.url+'/login', data, { headers: this._headers });
    }
    updateData(userdetails) {
        this.token = this.loadToken();
        console.log(userdetails);
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        headers.set('Content-Type', 'multipart/form-data');
        return this.http.post(this.url+'/update', userdetails, { headers: headers });
    }
    loggedIn() {
        this.loadToken();
        if (localStorage.getItem('token')) { return true } else { return false };
    }
    loadToken() {
        const token = localStorage.getItem('token');
        this.authToken = token;
        return token;
    }
   getProfile() {
        var userString = localStorage.getItem('user');
        userString = JSON.parse(userString)
        this.user = { 'user': userString };
        console.log(this.user);
        return this.user.user;

    }    storageUserData(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.authToken = data.token;

    }
    logout() {
       this.authToken = '';
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        localStorage.clear();
    }
}

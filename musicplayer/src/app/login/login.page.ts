import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loading = false;

  constructor(private router:Router) { }

  ngOnInit() {
  }
    onLogin(data) {
        this.loading = true;
        console.log(data);
        this.router.navigate(['/tabs/tab1']);
    }
}

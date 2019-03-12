import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserauthService } from '../userauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loading = false;
    public user: any;
    public errmessage: String;

    constructor(private router: Router, private userauth: UserauthService) { }

  ngOnInit() {
  }
    onLogin(data) {
        this.loading = true;
        console.log(data);
        this.userauth.Login(data).subscribe((data) => {
            console.log(data);
            this.user = data;
            if (this.user.success) {
                this.loading = false;
                this.userauth.storageUserData(data);
                this.router.navigate(['/tabs/tab1']);
            }
            else {
            this.loading = false;
                document.getElementById('errmessage').style.display = 'block';
                this.errmessage = 'invalid username/password';
            }
        })
       
    }
    closeerrmessage() {
        document.getElementById('errmessage').style.display = 'none';

    }
}

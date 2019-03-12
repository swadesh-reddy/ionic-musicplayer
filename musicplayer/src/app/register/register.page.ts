import { Component, OnInit } from '@angular/core';
import { UserauthService } from '../userauth.service';
import { Router } from '@angular/router';
import { User } from '../user';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    public user: any;
    public loading: any;
    public errmessage: any;

    constructor(private router: Router, private userauth: UserauthService) { }

  ngOnInit() {
  }
    onRegister(data) {
        console.log(data);
        this.userauth.onRegister(data).subscribe((userdata) => {
            console.log(userdata);
            this.user = userdata;
            if (this.user.success) {
                this.router.navigate(['/login']);
            } else {
                this.loading = false;
                document.getElementById('errmessage').style.display = 'block';
                this.errmessage = 'username already exists';
            }
        })
    }
    closeerrmessage() {
        document.getElementById('errmessage').style.display = 'none';
    
    }
}

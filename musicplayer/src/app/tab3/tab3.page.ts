import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserauthService } from '../userauth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    loading: Boolean = false;
    user: User;
    image: File = null;
    response: any;
    public pic:any
    public files: any[];
    constructor(private userauth: UserauthService, private router: Router, private camera: Camera) { }
    ngOnInit() {
        this.getProfile();
    }
    getProfile() {
        this.user = this.userauth.getProfile();
        this.pic = this.userauth.url +'/' + this.user.propic;
        console.log(this.user)
    }
    logout() {
        this.userauth.logout();
        this.router.navigate(['/login'])
    }
    onImageChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            this.image = <File>event.target.files[0];
            console.log(this.image.name);
        }
    }
    onUpdate(data) {
        console.log(data)
        if (this.image != null) {
            this.loading = true;
            var form = new FormData();
            form.append("username", data.username);
            form.append("password", data.password);
            form.append("email", data.email);
            form.append("contact", data.contact);
            form.append("propic", this.image, this.image.name);
            this.userauth.updateData(form).subscribe(data => {
                this.response = data;
                if (this.response.success) {
                    console.log(data);
                    this.loading = false;
                }
                else {
                    this.loading = false;
                    console.log(data);
                }
            });
        }
    }
    navigateToUploadSongs() {
        this.router.navigate(['/upload-songs'])
    }

    
    takePicture() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {   
            this.pic = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            // Handle error
            console.log("Camera issue:" + err);
        });
    }
    }

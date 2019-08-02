import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";
import { MusicAuthService } from '../music-auth.service';
import { CurrentMusicService } from '../current-music.service';
import { AllSongs } from '../allsongs';
import { SongInfo } from '../songInfo';
import { UserauthService } from '../userauth.service';
import { Location } from '@angular/common';
import { User } from '../user';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    public result: any
    public result1: any
    public files:any
 //   public file:File
    constructor(private file: File, private filepath: FilePath, private _location: Location, private platform: Platform, private musicauth: MusicAuthService, private currentmusic: CurrentMusicService, private userauth: UserauthService, private router: Router) {

       
    }
    ngOnInit() {
        this.file.listDir(this.file.dataDirectory, 'documents').then((data) => {
            this.getFiles(data)
        }).catch(err =>
         this.result = 'Directory doesnt exist');
       
    }
    getFiles(data) {
        this.result = JSON.stringify(data)
        
    }
}
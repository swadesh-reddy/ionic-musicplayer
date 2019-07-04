import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";
import { MusicAuthService } from '../music-auth.service';
import { CurrentMusicService } from '../current-music.service';
import { AllSongs } from '../allsongs';
import { File } from '@ionic-native/file/ngx';
import { SongInfo } from '../songInfo';
import { UserauthService } from '../userauth.service';
import { Location } from '@angular/common';
import { User } from '../user';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    public result: any
    public result1: any

    public name: Array<object> = [];
    constructor(private file: File, private _location: Location, private platform: Platform, private musicauth: MusicAuthService, private currentmusic: CurrentMusicService, private userauth: UserauthService, private router: Router) {

        platform.ready().then((readySource) => {

            file.listDir(file.dataDirectory, 'www/assets/downloads').then((result) => {
                this.result = JSON.stringify(result);
                console.log(result);
                for (let file of result) {
                    if (file.isDirectory == true && file.name != '.' && file.name != '..') {
                        // Code if its a folder
                    } else if (file.isFile == true) {
                        // Code if its a file

                        this.name.push(file)// File name

                      //  let path = file.path // File path
                        file.getMetadata(function (metadata) {
                            let size = metadata.size; // Get file size
                        })
                    }
                }
            })
})
    }
}

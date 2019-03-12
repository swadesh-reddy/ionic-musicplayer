import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MusicAuthService } from '../music-auth.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SongInfo } from '../songInfo';
import { UserauthService } from '../userauth.service';

import { User } from '../user';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    public user:User    
    public songInfo: SongInfo;
    public songImage: any;
    public pic: any;
    public song: any
    public screenwidth: any
    public blob: Blob;
    public songs:Array<object> =[];
    public favourite:Array<object> =[];
    public recent:Array<object> =[];
    public file: MediaObject;
    public allSongs: Array<object> = [];
    public headings = ['Most Popular', 'Your Favourite', 'recently'];
    public mood = ['love', 'party', 'sad', 'pleasent'];
    public color = ['#5cb85c', '#428bca', '	#d9534f', '#f9f9f9'];

    constructor(private musicauth: MusicAuthService, private userauth: UserauthService, private router: Router) { }

        ngOnInit() {
            this.getProfile();
            this.loadAllCategorySongs();
            this.loadFavouriteSongs();
            this.loadRecentSongs();
    }
    
    getProfile() {
        this.user = this.userauth.getProfile();
        this.pic = this.userauth.url + '/' + this.user.propic;
        console.log(this.pic)
    }
    loadAllCategorySongs() {
        this.musicauth.getMusic().subscribe((data) => {
            for (var song in data) {
                this.getMusicByName(data[song].song, this.songs);
            }
            this.allSongs.push(this.songs);
        })
    }
    loadFavouriteSongs() {
        this.musicauth.getFavouriteSongs().subscribe((data) => {
            console.log(data)
            for (var song in data) {
                data[song].songname = 'images/'+ data[song].songname+'.mp3';
                this.getMusicByName(data[song].songname, this.favourite);
            }
            this.allSongs.push(this.favourite);
            console.log(this.allSongs)
        })
    }
    loadRecentSongs() {
        this.musicauth.getRecentSongs().subscribe((data) => {
            console.log(data)
            for (var song in data) {
                data[song].songname = 'images/'+ data[song].songname+'.mp3';
                this.getMusicByName(data[song].songname, this.recent);
            }
            this.allSongs.push(this.recent);
            console.log(this.allSongs)
        })
    }
    handleSongs(tag:any, category) {
        tag.image = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(tag.tags.APIC.data.data)));
        tag.title = this.formatTitle(tag.tags.title, 30, 18)
        tag.album = this.formatTitle(tag.tags.album, 20, 0)
        category.push(tag);
      }

    getMusicByName(song ,category) {
        this.musicauth.getMusicFileByName(song).subscribe(data => {
            this.blob = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
            this.musicauth.getMeta(this, this.blob, category);
        })
    }

    uploadRecentSong(currentsongname) {
        let song = { songname: currentsongname }
        this.musicauth.findRecentSong(currentsongname).subscribe((data) => {
            console.log(data);
            if (data) {
                console.log(data);
            } else {
                this.musicauth.uploadRecentSong(song).subscribe((data) => { console.log(data) })
  }
        })
         }
    navigateToProfile() {
        this.router.navigate(['/tabs/tab3'])
    }
    formatTitle(songname, start, index) {
        songname = songname.substring(start, index);
        songname = songname + '..';
        return songname;
    }
    getColor(index) {
        return this.color[index];
    }
}

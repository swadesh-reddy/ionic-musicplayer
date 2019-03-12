import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { MusicAuthService } from '../music-auth.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { ActivatedRoute,Router } from '@angular/router';
import { SongInfo } from '../songInfo';
import { UserauthService } from '../userauth.service';

@Component({
  selector: 'app-currentmusic',
  templateUrl: './currentmusic.page.html',
  styleUrls: ['./currentmusic.page.scss'],
})
export class CurrentmusicPage implements OnInit {
    @ViewChild('audioOption') audioPlayerRef: ElementRef;
    @ViewChild('audiofile') audioFile: ElementRef;
    public playing: Boolean = false;
    public audio: any
    public currentTime: any
    public currminutes: any
    public currseconds: any
    public remainingTime: any
    public reminutes: any
    public reseconds: any
    public progressbarValue: any
    public clientWidth: any
    public currentSongloop: any
    public songInfo: SongInfo;
    public songImage: any
    public songs: any;
    public songname: any;
    public blob: Blob;
    public favouriteSong:Boolean
    

    constructor(private route: ActivatedRoute, platform: Platform, private nativeAudio: NativeAudio, private media: Media, private userauth: UserauthService, private musicauth: MusicAuthService, private router: Router) {

        platform.ready().then((readySource) => {
            this.clientWidth = platform.width();
        });
    }

    ngOnInit() {
        this.createMedia();
        this.loadSong();
     }
  
    createMedia() {
        this.songname = this.route.snapshot.paramMap.get('songname');
        this.songname = 'images/' +this.songname + '.mp3'
        this.musicauth.getMusicFileByName(this.songname).subscribe(data => {
            this.blob = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
            this.musicauth.getMeta(this, this.blob, this.songInfo);
        })

    }
    handleSongs(tag ,songInfo) {
        this.songInfo = tag;
        console.log(tag)
        this.songImage = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(tag.tags.APIC.data.data)));
    }
   
    loadSong() {
        this.checkFavouriteSong(this.songname.substr(7));
        this.songname = this.userauth.url + '/' + this.songname;
        this.audio = document.createElement('AUDIO');
        this.audio.setAttribute('src', this.songname);
        setInterval(() => {
            this.getCurrentTime();
            this.getRemainingTime();
            this.getProgressBarValue();
        }, 1000);
    }
    checkFavouriteSong(currentsongname) {
        console.log(currentsongname)
    this.musicauth.checkFavouriteSong(currentsongname).subscribe((data) => {
    console.log(data);
        if (data) {
            this.favouriteSong = true;
        } else {
            this.favouriteSong = false;
        }
        })
    }
    handleSong() {
        if (!this.playing) {
            this.playing = true;
            this.audio.play();
        } else {
            this.audio.pause();
            console.log('song paused');
            this.playing = false;
        }
      }
   
    navigateToHome() {
        this.router.navigate(['/tabs/tab1']);
    }
   
    getProgressBarValue() {
        this.progressbarValue = this.audio.currentTime / this.audio.duration;
    }
    setProgressBarValue(event) {
        this.progressbarValue = event.clientX / this.clientWidth;
        this.audio.currentTime = this.progressbarValue * this.audio.duration;
        this.audio.duration = this.audio.currentTime/this.progressbarValue;
    }

    getCurrentTime() {
        this.currminutes = this.formatMinutes(Math.floor(this.audio.currentTime));
        this.currseconds = this.formatSeconds(Math.floor(this.audio.currentTime - this.currminutes % 60));
        this.currentTime = this.currminutes + ':' + this.currseconds;
    }
    getRemainingTime() {
        this.reminutes = this.formatMinutes(this.audio.duration - this.audio.currentTime)
        this.reseconds = this.formatSeconds((this.audio.duration - this.audio.currentTime) - this.reminutes % 60);
        this.remainingTime = (this.reminutes) + ':' + (this.reseconds);
    }
    formatMinutes(minutes) {
        minutes = Math.floor(minutes / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        return minutes;
    }
    formatSeconds(seconds) {
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return seconds;
    }
    setloop() {
        this.currentSongloop = this.audio.loop;
        if (this.currentSongloop == false) {
            this.audio.loop = true
        } else {
            this.audio.loop = false;
        }
    }
    addFavouriteSong(currentsongname) {
       
        if (this.favouriteSong) {
            this.favouriteSong = false;
            this.musicauth.deleteFavouriteSong(currentsongname).subscribe((data) => {
                console.log(data)
            })
        } else{
            this.favouriteSong = true;
            let song = { songname: currentsongname }
            this.musicauth.uploadFavouriteSong(song).subscribe((data) => { console.log(data) })

        }
    }
   
     movesongBackword() {
       
    }
}

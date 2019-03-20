import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { MusicAuthService } from '../music-auth.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { SongInfo } from '../songInfo';
import { UserauthService } from '../userauth.service';
import { Location } from '@angular/common';
import { CurrentMusicService } from '../current-music.service';

@Component({
    selector: 'app-currentmusic',
    templateUrl: './currentmusic.page.html',
    styleUrls: ['./currentmusic.page.scss'],
})
export class CurrentmusicPage implements OnInit {
    @ViewChild('audio') audioPlayerRef: ElementRef;
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
    public currentsongname: any;
    public currentsong: any;
    public categoryname: any;
    public blob: Blob;
    public favouriteSong: Boolean;
    public currentsonglist: Array<object> = [];



    constructor(private _location: Location, private currentmusic: CurrentMusicService, private route: ActivatedRoute, platform: Platform, private nativeAudio: NativeAudio, private media: Media, private userauth: UserauthService, private musicauth: MusicAuthService, private router: Router) {

        platform.ready().then((readySource) => {
            this.clientWidth = platform.width();
        });
    }

    ngOnInit() {
    }

    getSongs(currentsong, songlist) {
        this.currentsonglist = songlist;
        for (var song in songlist) {
            if (songlist[song].tags.title == currentsong) {
                this.currentsong = this.currentsonglist[song];
                this.loadSong();
            }
        }
        console.log(this.currentsong, this.currentsonglist);
    }
 
    loadSong() {
        if (this.currentsong) {
            this.checkFavouriteSong(this.currentsong.tags.title);
            var audiourl = this.userauth.url + '/images/' + this.currentsong.tags.title + '.mp3';
            this.audio = document.createElement('AUDIO');
            this.audio.setAttribute('src', audiourl);
            this.audio.setAttribute('type', 'audio/mpeg');
            this.currentmusic.audio = this.audio;
            this.audio.play();
            this.currentmusic.playing = true;
            this.playing = this.currentmusic.playing;
            setInterval(() => {
                this.getCurrentTime();
                this.getRemainingTime();
                this.getProgressBarValue();
            }, 1000);
        }

    }

    handleSong() {
        if (!this.playing) {
            this.playing = true;
            this.audio.play();
            this.uploadRecentSong(this.currentsongname);
        } else {
            this.audio.pause();
            console.log('song paused');
            this.playing = false;
        }
    }

   

    getProgressBarValue() {
        this.progressbarValue = this.audio.currentTime / this.audio.duration;
    }
    setProgressBarValue(event) {
        this.progressbarValue = event.clientX / this.clientWidth;
        this.audio.currentTime = this.progressbarValue * this.audio.duration;
        this.audio.duration = this.audio.currentTime / this.progressbarValue;
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
    addFavouriteSong(currentsongname) {

        if (this.favouriteSong) {
            this.favouriteSong = false;
            this.musicauth.deleteFavouriteSong(currentsongname).subscribe((data) => {
                console.log(data)
            })
        } else {
            this.favouriteSong = true;
            let song = { songname: currentsongname }
            this.musicauth.uploadFavouriteSong(song).subscribe((data) => { console.log(data) })

        }
    }
    uploadRecentSong(currentsongname) {
        let song = { songname: currentsongname }
        this.musicauth.findRecentSong(currentsongname).subscribe((data) => {
            if (data) {
                console.log(data);
            } else {
                this.musicauth.uploadRecentSong(song).subscribe((data) => { console.log(data) })
            }
        })
    }
    
    updateCurrentSong(song) {
        this.audio.pause();
        this.playing = false;
        this.currentsong = song;
        this.loadSong();
    }
    playNextSong() {
        for (var i = 0; i < this.currentsonglist.length; i++) {
            var song: any = this.currentsonglist[i];
            if (song.tags.title == this.currentsong.tags.title) {
                if (i < this.currentsonglist.length-1) {
                    this.updateCurrentSong(this.currentsonglist[++i])
                }
            }
        }
    }
    playPreviousSong() {
        console.log(typeof (this.currentsonglist));
        for (var song in this.currentsonglist) {
            var currentsong:any = this.currentsonglist[song];
            if (currentsong.tags.title == this.currentsong.tags.title) {
                if (Number(song) > 0) {
                    this.updateCurrentSong(this.currentsonglist[Number(song) - 1]);
                }
           }
        }
    }

    navigateToHome() {
        this._location.back();
    }
}

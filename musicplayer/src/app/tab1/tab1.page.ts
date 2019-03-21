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

var $:any
@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    @ViewChild('currentMusicLibrary') currentMusicLibraryRef: ElementRef;

    public user: User
    public songInfo: SongInfo;
    public pic: any;
    public playing: Boolean;
    public greet: any
    public song: any;
    public shuffle: any;
    public screenwidth: any
    public blob: Blob;
    public audioqueue: Array<object> = [];
    public songs: Array<object> = [];
    public favourite: Array<object> = [];
    public recent: Array<object> = [];
    public currentsonglist: Array<object> = [];
    public currentsong: any;
    public allSongs: any = {};
    public audio: any
    public currentTime: any
    public currminutes: any
    public currseconds: any
    public remainingTime: any
    public reminutes: any
    public currentMusicPageView: Boolean = false;
    public reseconds: any
    public progressbarValue: any
    public clientWidth: any
    public clientHeight: any
    public currentSongloop: any
    public songImage: any;
    public favouriteSong: Boolean;
    public currentsongname: any;
    public audiourl: any;
    public categoryname: any;
    public imgHeight: any;
    public mood = ['Love', 'party', 'sad', 'pleasent'];
    public color = ['#5cb85c', '#428bca', '	#d9534f', '#f9f9f9'];

    constructor(private _location: Location, private platform: Platform, private musicauth: MusicAuthService, private currentmusic: CurrentMusicService, private userauth: UserauthService, private router: Router) {

        platform.ready().then((readySource) => {
            this.clientWidth = platform.width();
            this.clientHeight = platform.height();
             this.imgHeight = this.clientHeight - this.clientHeight / 2;
            this.clientHeight = (this.clientHeight-98)+'px';
            console.log(this.clientHeight);

        });
    }

    ngOnInit() {
        this.getProfile();
        this.loadAllCategorySongs();
        this.loadFavouriteSongs();
        this.loadRecentSongs();
        this.greetUser();
    }

    getProfile() {
        this.user = this.userauth.getProfile();
        this.pic = this.userauth.url + '/' + this.user.propic;
        console.log(this.pic)
    }
    loadAllCategorySongs() {
        this.musicauth.getMusic().subscribe((data) => {
            this.getMusicByName(data, this.songs);
            this.allSongs.Most_popular = this.songs;
        })
    }
    loadFavouriteSongs() {
        this.musicauth.getFavouriteSongs().subscribe((data) => {
            this.getMusicByName(data, this.favourite);
            this.allSongs.Your_Favourites = this.favourite;
        })
    }
    loadRecentSongs() {
        this.musicauth.getRecentSongs().subscribe((data) => {
            this.getMusicByName(data, this.recent);
            this.allSongs.recent = this.recent;
        })
    }
    handleSongs(blob, tag: any, category) {
        tag.image = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(tag.tags.APIC.data.data)));
        tag.title = this.musicauth.formatTitle(tag.tags.title, 30, 18);
        tag.blob = blob;
        category.push(tag);
    }

    getMusicByName(data, category) {
        for (var song in data) {
            data[song].songname = 'images/' + data[song].songname + '.mp3';
            this.musicauth.getMusicFileByName(data[song].songname).subscribe(data => {
                this.blob = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
                 this.musicauth.getMeta(this, this.blob, category);
            })
        }
    }
    navigateToHome() {
        this.currentMusicPageView = false;
    }
    openCurrentMusic() {
        this.currentMusicPageView = true;
    }

    navigateToProfile() {
        this.router.navigate(['/tabs/tab3'])
    }
    getColor(index) {
        return this.color[index];
    }
   
    loadSong() {
        if (this.currentsong) {
            this.checkFavouriteSong(this.currentsong.tags.title);
            this.audio = document.createElement('AUDIO');
            var audiourl = window.URL.createObjectURL(this.currentsong.blob)
            console.log(audiourl)
            this.audio.setAttribute('src', audiourl);
            this.audio.setAttribute('type', 'audio/mpeg');
            this.audio.play();
            this.playing = true;
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
        if (this.remainingTime == "00:00") {
            this.playNextSong();
        }
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
        if (this.shuffle) {
            this.shuffle = false;
        }
        else {
            this.shuffle = true;
        }
        for (var song in this.currentsonglist) {
            var songlist: any = this.currentsonglist;
            if (songlist[song].tags.title != this.currentsong.tags.title) {
                var random = Math.random() * songlist.length;
                random = Math.floor(random);
                var temp;
                temp = songlist[song];
                songlist[song] = songlist[random];
                songlist[random] = temp;
            }
        }
        this.currentsonglist = songlist;
    }
    checkFavouriteSong(currentsongname) {
        this.musicauth.checkFavouriteSong(currentsongname).subscribe((data) => {
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
                console.log(data);
                this.musicauth.uploadRecentSong(song).subscribe((data) => { console.log(data) })
            }
        })
    }
    downloadSong(songname) {
        console.log(songname)
        songname = songname+'.mp3'
        this.musicauth.downloadSong(songname).subscribe((data) => {
            console.log(data);
            this.blob = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
                
        })
    }
    updateCurrentSong(song) {
        this.audio.pause();
        this.playing = false;
        this.currentsong = song;
        this.currentTime = 0;
        this.remainingTime = 0;
        this.loadSong();
    }
    playNextSong() {
        for (var i = 0; i < this.currentsonglist.length; i++) {
            var song: any = this.currentsonglist[i];
            console.log(song.tags.title)
            if (song.tags.title == this.currentsong.tags.title) {
                if (i < this.currentsonglist.length) {
                    console.log(i, this.currentsonglist.length)
                    this.updateCurrentSong(this.currentsonglist[++i])
                }
            }
        }
    }
    playPreviousSong() {
        console.log(typeof (this.currentsonglist));
        for (var song in this.currentsonglist) {
            var currentsong: any = this.currentsonglist[song];
            if (currentsong.tags.title == this.currentsong.tags.title) {
                if (Number(song) > 0) {
                    this.updateCurrentSong(this.currentsonglist[Number(song) - 1]);
                }
            }
        }
    }
    updatedCurrentSong(currentsong, songlist) {
        this.currentMusicPageView = true;
        if (this.currentsong) {
            this.currentsong = '';
            this.currentsonglist = [];
            this.audio.pause();
        }
        for (var song in songlist) {
            if (songlist[song].tags.title == currentsong) {
                this.currentsong = songlist[song];
                this.loadSong();
            }
            songlist[song].fulltitle = songlist[song].tags.title.substring(35, 18)
        }
        this.uploadRecentSong(currentsong);
        this.currentsonglist = songlist;
    }

    greetUser() {
        var Hours = new Date().getHours();
        if (Hours < 12) {
            this.greet = 'Good Morning';
        }
        else if (Hours > 12 && Hours < 16) {
            this.greet = 'Good Afternoon';
        }
        else if (Hours > 15 && Hours < 21) {
            this.greet = 'Good Evening';
        }
        else {
            this.greet = 'Good Night';
        }
    }
    goToFrontLocation() {
        this._location.forward();
    }
    addToAudioQueue(song) {
        this.audioqueue.push(song);
        console.log(this.audioqueue);
    }
    removeFromAudioQueue(song) {
        if (this.audioqueue) {
            var songlist:any = this.audioqueue;
            for (var i = 0; i < songlist.length; i++) {
                if (songlist[i].tags.title === song.tags.title) {
                    this.audioqueue.splice(i, 1);
                    console.log(this.audioqueue)
                }
            }
        }
    }
    clearAudioQueue() {
        this.audioqueue = [];
    }
    removeFromCurrentplaylist(song) {
        if (this.currentsonglist) {
            var songlist: any = this.currentsonglist;
            for (var i = 0; i < songlist.length; i++) {
                if (songlist[i].tags.title === song.tags.title) {
                    this.currentsonglist.splice(i, 1);
                    console.log(this.currentsonglist)
                }
            }
        }
    }
}

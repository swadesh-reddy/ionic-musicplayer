import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { MusicAuthService } from '../music-auth.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { SongInfo } from '../songInfo';
declare var jsmediatags: any;
import * as jsmediatags from "jsmediatags";

@Component({
  selector: 'app-currentmusic',
  templateUrl: './currentmusic.page.html',
  styleUrls: ['./currentmusic.page.scss'],
})
export class CurrentmusicPage implements OnInit {
    @ViewChild('audioOption') audioPlayerRef: ElementRef;
    @ViewChild('audiofile') audioFile: ElementRef;
    public playing: Boolean = false;
    public currentTime: any
    public currminutes: any
    public currseconds: any
    public remainingTime: any
    public reminutes: any
    public reseconds: any
    public progressbarValue: any
    public clientWidth: any
    public currentSongloop: any
    public audiourl: any
    public songInfo: SongInfo;
    public songImage: any

    constructor(platform: Platform, private nativeAudio: NativeAudio, private media: Media, private musicauth: MusicAuthService) {

        platform.ready().then((readySource) => {
            this.clientWidth = platform.width();
        });
    }

    ngOnInit() {
        this.createMedia();
        setInterval(() => {
            this.getCurrentTime();
            this.getRemainingTime();
            this.getProgressBarValue();
        }, 1000);
     }
  
    createMedia() {
        this.musicauth.getMusicFile().subscribe(data => {
            this.audiourl = '../assets/images/NeekemKaavaaloCheppu.mp3'; 
            this.getMeta(data);
         })

    }
    playSong() {
        this.playing = true;
        this.audioPlayerRef.nativeElement.play();
     }

    getMeta(blob) {
       jsmediatags.read(blob, {
            onSuccess: tag => {
                this.songInfo = tag;
                console.log(this.songInfo);
                this.songImage = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(tag.tags.APIC.data.data)));
             },
            onError: error => {
                alert('error');
                console.log(error);
            }
        });
    }
    pauseSong() {
        this.playing = false;
        this.audioPlayerRef.nativeElement.pause();
    }
    getProgressBarValue() {
        this.progressbarValue = this.audioPlayerRef.nativeElement.currentTime / this.audioPlayerRef.nativeElement.duration;
    }
    setProgressBarValue(event) {
        this.progressbarValue = event.clientX / this.clientWidth;
    }
    getCurrentTime() {
        this.currminutes = this.formatMinutes(Math.floor(this.audioPlayerRef.nativeElement.currentTime));
        this.currseconds = this.formatSeconds(Math.floor(this.audioPlayerRef.nativeElement.currentTime - this.currminutes % 60));
        this.currentTime = this.currminutes + ':' + this.currseconds;
    }
    getRemainingTime() {
        this.reminutes = this.formatMinutes(this.audioPlayerRef.nativeElement.duration - this.audioPlayerRef.nativeElement.currentTime)
        this.reseconds = this.formatSeconds((this.audioPlayerRef.nativeElement.duration - this.audioPlayerRef.nativeElement.currentTime) - this.reminutes % 60);
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
        this.currentSongloop = this.audioPlayerRef.nativeElement.loop;
        if (this.currentSongloop == false) {
            this.audioPlayerRef.nativeElement.loop = true
        } else {
            this.audioPlayerRef.nativeElement.loop = false;
        }
    }
    

    movesongBackword() {
       
    }
}

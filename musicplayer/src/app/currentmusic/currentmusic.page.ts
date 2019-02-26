import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-currentmusic',
  templateUrl: './currentmusic.page.html',
  styleUrls: ['./currentmusic.page.scss'],
})
export class CurrentmusicPage implements OnInit {
    @ViewChild('audioOption') audioPlayerRef: ElementRef;
    public playing: Boolean = false;
    public currentTime: any
    public currminutes: any
    public currseconds: any
    public remainingTime: any
    public reminutes: any
    public reseconds: any
    public progressbarValue: any
    public clientWidth:any

    constructor(platform: Platform) {
        platform.ready().then((readySource) => {
            this.clientWidth = platform.width();
            console.log('Width: ' + platform.width());
            console.log('Height: ' + platform.height());
        });
    }

    ngOnInit() {
        setInterval(() => {
            this.getCurrentTime();
            this.getRemainingTime();
            this.getProgressBarValue();
        }, 1000);
    }

    playSong() {
        this.playing = true;
        console.log(this.audioPlayerRef.nativeElement.duration); // will get you a lot more updates.
        this.audioPlayerRef.nativeElement.play();
    }
    pauseSong() {
        this.playing = false;
        this.audioPlayerRef.nativeElement.pause();
    }
    getProgressBarValue() {
        this.progressbarValue = this.audioPlayerRef.nativeElement.currentTime / this.audioPlayerRef.nativeElement.duration;
        console.log(this.audioPlayerRef.nativeElement.currentTime);
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
    movesongBackword() {
        console.log(this.currseconds);
        this.currminutes = this.formatMinutes(this.audioPlayerRef.nativeElement.currentTime);
        this.currseconds = this.currseconds - 20;
        console.log(this.currseconds)
    }
}

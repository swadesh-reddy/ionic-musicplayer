import { Injectable } from '@angular/core';
import { UserauthService } from './userauth.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMusicService {
    public currentsong: any
    public currentsonglist: Array<object> = [];
    public playing: Boolean = false;
    public audio: any


    constructor(private userauth: UserauthService) { }

    setCurrentSongStatus(song, songlist) {
        this.currentsong = song;
        this.currentsonglist = songlist;
        console.log(this.currentsong, this.currentsonglist)
    }
    getCurrentSongStatus(Object) {
        Object.getSongs(this.currentsong, this.currentsonglist);
    }
  
}

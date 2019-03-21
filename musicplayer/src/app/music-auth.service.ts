import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserauthService } from './userauth.service';
declare var jsmediatags: any;
import * as jsmediatags from "jsmediatags";

@Injectable({
    providedIn: 'root'
})
export class MusicAuthService {
    public token: any
    private _headers = new HttpHeaders({
        "cache-control": 'no-cache',
    });
    constructor(private http: HttpClient, private userauth: UserauthService) { }

    getMusic() {
        return this.http.get(this.userauth.url + '/getMusic');

    }

    getMusicFile() {
        return this.http.get(this.userauth.url + '/getMusic');

    }
   
    getRecentSongs() {
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/getRecentMusic', { headers: headers });

    }
    getMusicFileByName(songname) {
        let params = new HttpParams().set('songname', songname);
        return this.http.get(this.userauth.url + '/getMusicByName', { params: params, responseType: 'arraybuffer' });
    }
    uploadMusic(songdetails) {
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        headers.set('Content-Type', 'multipart/form-data');
        return this.http.post(this.userauth.url + '/uploadsong', songdetails, { headers: headers })
    }
    uploadFavouriteSong(songdetails) {
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        headers.set('Content-Type', 'multipart/form-data');
        return this.http.post(this.userauth.url + '/addFavouriteMusic', songdetails, { headers: headers })
    }
    checkFavouriteSong(currentsongname) {
        var params = new HttpParams().set('songname', currentsongname);
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/checkFavouriteSong', { params: params, headers: headers });
    }
    deleteFavouriteSong(currentsongname) {
        var params = new HttpParams().set('songname', currentsongname);
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/deleteFavouriteSong', { params: params, headers: headers });
    }
    getFavouriteSongs() {
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/getFavouriteMusic', { headers: headers });

    }
    uploadRecentSong(songdetails) {
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        headers.set('Content-Type', 'multipart/form-data');
        return this.http.post(this.userauth.url + '/addRecentMusic', songdetails, { headers: headers })
    }
    findRecentSong(song) {
        var  params = new HttpParams().set('songname', song);
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/findRecentMusic', {params: params, headers: headers });
    }
    downloadSong(song) {
        var params = new HttpParams().set('songname', song);
        this.token = this.userauth.loadToken();
        const headers = this._headers.append('Authorization', 'Bearer ' + this.token);
        return this.http.get(this.userauth.url + '/download', { params: params, headers: headers, responseType: 'arraybuffer' });
    }
    getMeta(object, blob, category) {
        jsmediatags.read(blob, {
            onSuccess: tag => {
                object.handleSongs(blob, tag, category);
            },
            onError: error => {
                console.log('error');
                console.log(error);
            }
        });
    }
    formatTitle(songname, start, index) {
        songname = songname.substring(start, index);
        songname = songname + '..';
        return songname;
    }

}

import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { SongInfo } from '../songInfo';
declare var jsmediatags: any;
import * as jsmediatags from "jsmediatags";
import { MusicAuthService } from '../music-auth.service';
@Component({
  selector: 'app-upload-songs',
  templateUrl: './upload-songs.page.html',
  styleUrls: ['./upload-songs.page.scss'],
})
export class UploadSongsPage implements OnInit {
    public user: User;
    public song: any;
    public date:Date
    public albumname: any;
    public songname: any;
    public artist: any;
    public genre: any;

    constructor(private musicauth: MusicAuthService) { }

  ngOnInit() {
  }


    onFileChange(data) {
        console.log(data)
        if (data.target.files && data.target.files.length > 0) {
            this.song = <File>data.target.files[0];
            console.log(this.song.name);
        }
        jsmediatags.read(data.target.files[0], {
            onSuccess: tag => {
                this.songname = tag.tags.title;
                this.albumname = tag.tags.album;
                this.genre = tag.tags.genre;
                this.artist = tag.tags.artist;
                console.log(this.songname)
                 },
            onError: error => {
                console.log('error');
                console.log(error);
            }
        });
    }
    onSongupload(data) {
            var songname = 'images/' + this.songname + '.mp3';
        this.musicauth.getMusicFileByName(songname).subscribe(song => {
            console.log(song.byteLength)
            if (song.byteLength < 1 ) {
            this.date = new Date();
            console.log(this.date)
            var form = new FormData();
            form.append("songname", this.songname);
            form.append("albumname", this.albumname);
            form.append("genre", this.genre);
            form.append("artist", this.artist);
            form.append("songType", data.songType);
            form.append("song", this.song, this.song.name);
            this.musicauth.uploadMusic(form).subscribe((data) => {
                console.log(data);
            })
            }
            })
       
    }
   

}

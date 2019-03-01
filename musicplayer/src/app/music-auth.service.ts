import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MusicAuthService {

    constructor(private http: HttpClient) { } 

    getMusicFile() {
        var music = this.http.get('../assets/images/NeekemKaavaaloCheppu.mp3', { responseType: 'blob' });
        return music;
 }
}

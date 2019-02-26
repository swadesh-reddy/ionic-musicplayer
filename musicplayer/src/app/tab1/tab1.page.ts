import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
        ngOnInit() {
            document.getElementById('scrollX').style.width = Number(window.innerWidth * 0.97) + 'px';
            document.getElementById('scroll1').style.width = Number(window.innerWidth * 0.97) + 'px';
            document.getElementById('scroll2').style.width = Number(window.innerWidth * 0.97) + 'px';
        }}

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items:Array<number>;

  constructor(public navCtrl: NavController) {
    this.items = [16384,8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,0,0]
  }

}

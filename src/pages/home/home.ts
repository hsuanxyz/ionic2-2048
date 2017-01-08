import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items:Array<number>;

  constructor(public navCtrl: NavController) {
    // this.items = [16384,8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,0,0];
    this.init();
  }

  static getRandomIntInclusive(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  init(){
    this.items = new Array(16).fill(0);
    this.randomFill();
    this.randomFill();
  }

  start(){
    this.init();
  }

  /**
   * 获取元素为0的索引数组
   * @returns {Array}
   */
  findFullIndex():Array<number>{
    let indexArr = [];
    this.items.forEach((item,index) => {
      if(item ===0){
        indexArr.push(index);
      }
    });
    return indexArr;
  }

  /**
   * 随机填充空位
   */
  randomFill() {
    let indexArr: Array<number>;
    let fillIndex: number;
    let random: number;

    indexArr = this.findFullIndex();
    fillIndex = HomePage.getRandomIntInclusive(0,indexArr.length-1);
    random = Math.random() >= 0.5 ? 4 : 2;
    this.items[indexArr[fillIndex]] = random;
  }

  up(){
    this.items.forEach( (item,index,arr) =>{
      if((index-4) < 0) return;
      if((arr[index-4]) === 0){
        arr[index-4] = item;
        arr[index] = 0;
      }
    })
  }



}

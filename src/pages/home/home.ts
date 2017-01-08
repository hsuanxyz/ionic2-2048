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
    let mergeList = [];
    for(let i = 0; i < 4; i++) {
      this.items.forEach( (item,index,arr) => {
          if(this.canMoveUp(index)){
            this.items[index-4] = item;
            this.items[index] = 0;
          }else if(this.canMergeUp(index) && mergeList.indexOf(index) === -1){
            mergeList.push(index-4);
            this.items[index-4] = item*2;
            this.items[index] = 0;
          }

      });
    }

    this.randomFill();

  }

  down(){
    let mergeList = [];
    for(let i = 0; i < 4; i++) {
      this.items.forEach( (item,index,arr) => {
        if(this.canMoveDown(index)){
          this.items[index+4] = item;
          this.items[index] = 0;
        }else if(this.canMergeDown(index) && mergeList.indexOf(index) === -1){
          mergeList.push(index+4);
          this.items[index+4] = item*2;
          this.items[index] = 0;
        }

      });
    }

    this.randomFill();
  }

  left(){
    let mergeList = [];
    for(let i = 0; i < 4; i++) {
      this.items.forEach( (item,index,arr) => {
        if(this.canMoveLeft(index)){
          this.items[index-1] = item;
          this.items[index] = 0;
        }else if(this.canMergeLeft(index) && mergeList.indexOf(index) === -1){
          mergeList.push(index-1);
          this.items[index-1] = item*2;
          this.items[index] = 0;
        }

      });
    }

    this.randomFill();
  }

  right(){
    let mergeList = [];
    for(let i = 0; i < 4; i++) {
      this.items.forEach( (item,index,arr) => {
        if(item !== 0){
          if(this.canMoveRight(index)){
            this.items[index+1] = item;
            this.items[index] = 0;
          }else if(this.canMergeRight(index) && mergeList.indexOf(index) === -1){
            mergeList.push(index+1);
            this.items[index+1] = item*2;
            this.items[index] = 0;
          }
        }
      });
    }

    this.randomFill();
  }

  canMoveUp(index){
    if(index < 4) return false;
    if(this.items[index-4] === 0) return true;
  }

  canMergeUp(index){
    if(index < 4) return false;
    if(this.items[index-4] === this.items[index]) return true;
  }

  canMoveDown(index){
    if(index > 11) return false;
    if(this.items[index+4] === 0) return true;
  }

  canMergeDown(index){
    if(index > 11) return false;
    if(this.items[index+4] === this.items[index]) return true;
  }

  canMoveLeft(index){
    if([4,8,12,16].indexOf(index) !== -1) return false;
    if(this.items[index-1] === 0) return true;
  }

  canMergeLeft(index){
    if([4,8,12,16].indexOf(index) !== -1) return false;
    if(this.items[index-1] === this.items[index]) return true;
  }
  canMoveRight(index){
    if([3,7,11,15].indexOf(index) !== -1) return false;
    if(this.items[index+1] === 0) return true;
  }

  canMergeRight(index){
    if([3,7,11,15].indexOf(index) !== -1) return false;
    if(this.items[index+1] === this.items[index]) return true;
  }
}

import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';

declare let window;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items:Array<number>;
  audio:any;

  constructor(
    public navCtrl: NavController,
    public events: Events
  ) {
    this.audio = new Audio();
    this.audio.src = "../assets/901.wav";
    this.audio.load();
    this.init();
  }

  ionViewDidLoad() {

    this.events.subscribe('event:swipe', (type) => {
      switch (type) {
        case 'up':
          this.up();
          break;
        case 'down':
          this.down();
          break;
        default:
          break;
      }
    });

  }

  static getRandomIntInclusive(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  init(){
    this.items = new Array(16).fill(0);
    // this.items = [
    //   4,2,4,8,
    //   4,2,2,4,
    //   2,4,2,2,
    //   2,4,4,2
    // ];

    this.randomFill();
    this.randomFill();
  }

  start(){

    this.init();
  }

  swipeEvent($e) {
    switch ($e.direction) {
      case 2:
        this.left();
        break;
      case 4:
        this.right();
        break;
      default:
        break;
    }

  }

  isGameOver():boolean {

    for(let i = 0; i < this.items.length; i++){
      let item = this.items[i];

      if(item === 0) return true;
      if(
        this.canMoveLeft(i)
        || this.canMoveUp(i)
        || this.canMoveRight(i)
        || this.canMoveDown(i)
        || this.canMergeUp(i)
        || this.canMergeDown(i)
        || this.canMergeLeft(i)
        || this.canMergeRight(i)
      ){
        return true;
      }
    }
    console.log('game over!');
    return false;
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
    this.audio.play();
    let indexArr: Array<number>;
    let fillIndex: number;
    let random: number;

    indexArr = this.findFullIndex();
    fillIndex = HomePage.getRandomIntInclusive(0,indexArr.length-1);
    random = Math.random() >= 0.5 ? 4 : 2;
    this.items[indexArr[fillIndex]] = random;
  }

  up(){
    let isNext = false;
    let mergeList = [];
    for(let i = 0; i < 4; i++) {

      for(let index = 0; index < this.items.length; index++){
        let item = this.items[index];

        if(this.canMoveUp(index)){
          this.items[index-4] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeUp(index) && mergeList.indexOf(index) === -1){
          mergeList.push(index-4);
          mergeList.push(index);
          this.items[index-4] = item*2;
          this.items[index] = 0;
          isNext = true;
        }
      }


    }
    if(isNext){
      this.randomFill();
    }
    this.isGameOver();
  }

  down(){
    let isNext = false;
    let mergeList = [];
    for(let i = 0; i < 3; i++) {

      for(let index = this.items.length-1; index >= 0; index--){
        let item = this.items[index];

        if(this.canMoveDown(index)){
          this.items[index+4] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeDown(index) && mergeList.indexOf(index+4) === -1 && mergeList.indexOf(index) === -1){
          mergeList.push(index+4);
          this.items[index+4] = item*2;
          this.items[index] = 0;
          isNext = true;
        }
      }

    }
    if(isNext){
      this.randomFill();
    }
    this.isGameOver();

  }

  left(){
    let isNext = false;
    let mergeList = [];

    for(let i = 0; i < 4; i++) {

      for(let index = 0; index < this.items.length; index++){
        let item = this.items[index];

        if(this.canMoveLeft(index) ){
          this.items[index-1] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeLeft(index) &&  mergeList.indexOf(index) === -1){
          mergeList.push(index-1);
          mergeList.push(index);
          this.items[index-1] = item*2;
          this.items[index] = 0;

          isNext = true;
        }
      }
    }

    if(isNext){
      this.randomFill();
    }
    this.isGameOver();

  }

  right(){
    let isNext = false;
    let mergeList = [];

    for(let i = 0; i < 4; i++) {

      for(let index = this.items.length-1; index >= 0; index--){
        let item = this.items[index];

        if(item !== 0){
          if(this.canMoveRight(index)){
            this.items[index+1] = item;
            this.items[index] = 0;
            isNext = true;
          }else if(this.canMergeRight(index) && mergeList.indexOf(index) === -1 && mergeList.indexOf(index+1)===-1){
            mergeList.push(index+1);
            this.items[index+1] = item*2;
            this.items[index] = 0;
            isNext = true;
          }
        }
      }

    }
    if(isNext){
      this.randomFill();
    }
    this.isGameOver();

  }

  canMoveUp(index){
    if(this.items[index] === 0) return false;
    if(index < 4) return false;
    if(this.items[index-4] === 0) return true;
  }

  canMergeUp(index){
    if(this.items[index] === 0) return false;
    if(index < 4) return false;
    if(this.items[index-4] === this.items[index]) return true;
  }

  canMoveDown(index){
    if(this.items[index] === 0) return false;
    if(index > 11) return false;
    if(this.items[index+4] === 0) return true;
  }

  canMergeDown(index){
    if(this.items[index] === 0) return false;
    if(index > 11) return false;
    if(this.items[index+4] === this.items[index]) return true;
  }

  canMoveLeft(index){
    if(this.items[index] === 0) return false;
    if([0,4,8,12].indexOf(index) !== -1) return false;
    if(this.items[index-1] === 0) return true;
  }

  canMergeLeft(index){
    if(this.items[index] === 0) return false;
    if([0,4,8,12].indexOf(index) !== -1) return false;
    if(this.items[index-1] === this.items[index]) return true;
  }
  canMoveRight(index){
    if(this.items[index] === 0) return false;
    if([3,7,11,15].indexOf(index) !== -1) return false;
    if(this.items[index+1] === 0) return true;
  }

  canMergeRight(index){
    if(this.items[index] === 0) return false;
    if([3,7,11,15].indexOf(index) !== -1) return false;
    if(this.items[index+1] === this.items[index]) return true;
  }


}

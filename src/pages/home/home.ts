import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, Events } from 'ionic-angular';
import {highlight} from "@ionic/app-scripts/dist/highlight/highlight";

declare let window;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items:Array<number>;
  audio:any;
  showGameOver:boolean = false;
  score:number = 0;
  highest:number = 0;
  historical:Array< Array<number> > = [];
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public storage: Storage,
  ) {
    this.audio = new Audio();
    this.audio.src = "../assets/901.wav";
    this.audio.load();
    this.findHistory();
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
    this.randomFill();
    this.randomFill();
    // this.items = [
    //   32,16,4,4,
    //   0,0,0,2,
    //   0,4,0,0,
    //   0,0,0,2
    // ];
  }

  start(){
    this.historical = [];
    this.recordScore(0);
    this.init();
    this.initHistory();
  }

  restore(){
    if(this.historical.length){
      this.items = this.historical.pop()
    }else {
      console.log('not historical')
    }
  }

  setHistorical(arr:Array<number>){
    if(this.historical.length >= 5){
      this.historical.shift();
    }
    this.historical.push(arr)
    this.storage.set('historical',this.historical);
  }

  initHistory(){
    this.storage.set('history-score',this.score);
    this.storage.set('history-highest',this.highest);
    this.storage.set('history-items',this.items);
    this.storage.set('historical',[]);
  }

  serHistoryAndRefreshHighest(){
    this.highest = this.score >= this.highest ? this.score : this.highest;
    this.storage.set('history-score',this.score);
    this.storage.set('history-items',this.items);
    this.storage.set('history-highest',this.highest);
  }

  findHistory(){
    this.storage.get('history-score')
      .then( res => {
        if(!res || res === 0){
          this.init();
          this.initHistory();
        }else {
          this.score = res;
          this.storage.get('history-items')
            .then( res => {
              this.items = res;
            });
          this.storage.get('history-highest')
            .then( res => {
              this.highest = res;
            });
          this.storage.get('historical')
            .then( res => {
              this.historical = res;
            });
        }
      })
      .catch( err => {
        this.initHistory();
      })
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

  refereeGameOver():boolean {

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
    this.showGameOver = true;
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
    random = Math.random() >= 0.666 ? 4 : 2;
    this.items[indexArr[fillIndex]] = random;
  }

  up(){
    let isNext = false;
    let mergeList = [];
    let arr = Array.from(this.items);
    for(let i = 0; i < 4; i++) {

      for(let index = 0; index < this.items.length; index++){
        let item = this.items[index];

        if(this.canMoveUp(index)){
          this.items[index-4] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeUp(index) && mergeList.indexOf(index) === -1){
          mergeList.push(index-4);
          this.recordScore(item);
          mergeList.push(index);
          this.items[index-4] = item*2;
          this.items[index] = 0;
          isNext = true;
        }
      }


    }
    if(isNext){
      this.setHistorical(arr);
      this.randomFill();
      this.serHistoryAndRefreshHighest();
    }
    this.refereeGameOver();
  }

  down(){
    let isNext = false;
    let mergeList = [];
    let arr = Array.from(this.items);
    for(let i = 0; i < 3; i++) {

      for(let index = this.items.length-1; index >= 0; index--){
        let item = this.items[index];

        if(this.canMoveDown(index)){
          this.items[index+4] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeDown(index) && mergeList.indexOf(index+4) === -1 && mergeList.indexOf(index) === -1){
          mergeList.push(index+4);
          this.recordScore(item);
          this.items[index+4] = item*2;
          this.items[index] = 0;
          isNext = true;
        }
      }

    }
    if(isNext){
      this.setHistorical(arr);
      this.randomFill();
      this.serHistoryAndRefreshHighest();
    }

    this.refereeGameOver();

  }

  left(){
    let isNext = false;
    let mergeList = [];
    let arr = Array.from(this.items);

    for(let i = 0; i < 4; i++) {

      for(let index = 0; index < this.items.length; index++){
        let item = this.items[index];

        if(this.canMoveLeft(index) ){
          this.items[index-1] = item;
          this.items[index] = 0;
          isNext = true;
        }else if(this.canMergeLeft(index) &&  mergeList.indexOf(index) === -1){
          mergeList.push(index-1);
          this.recordScore(item);
          mergeList.push(index);
          this.items[index-1] = item*2;
          this.items[index] = 0;

          isNext = true;
        }
      }
    }

    if(isNext){
      this.setHistorical(arr);
      this.randomFill();
      this.serHistoryAndRefreshHighest();

    }
    this.refereeGameOver();

  }

  right(){
    let arr = Array.from(this.items);

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
            this.recordScore(item);
            this.items[index+1] = item*2;
            this.items[index] = 0;
            isNext = true;
          }
        }
      }

    }
    if(isNext){
      this.setHistorical(arr);
      this.randomFill();
      this.serHistoryAndRefreshHighest();

    }
    this.refereeGameOver();

  }

  recordScore(num:number){
    if(num === 0 ){
      this.score = 0;
    }
    this.score += num;
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

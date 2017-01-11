import {Directive, ElementRef, Input, OnInit, OnDestroy} from '@angular/core'
import {Events} from 'ionic-angular';
import {Gesture} from 'ionic-angular/gestures/gesture'
declare var Hammer: any

/*
 Class for the SwipeVertical directive (attribute (swipe) is only horizontal).

 In order to use it you must add swipe-vertical attribute to the component.
 The directives for binding functions are [swipeUp] and [swipeDown].

 IMPORTANT:
 [swipeUp] and [swipeDown] MUST be added in a component which
 already has "swipe-vertical".
 */

@Directive({
  selector: '[swipe-vertical]' // Attribute selector
})
export class SwipeVertical implements OnInit, OnDestroy {


  private el: HTMLElement;
  private swipeGesture: Gesture;

  constructor(el: ElementRef,public events: Events) {
    this.el = el.nativeElement;
    this.events = events;
  }

  ngOnInit() {
    this.swipeGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_VERTICAL}]
      ]
    });
    this.swipeGesture.listen();
    this.swipeGesture.on('swipeup', e => {
      console.log('swipeup!!');
      this.events.publish('event:swipe','up');

    })
    this.swipeGesture.on('swipedown', e => {
      console.log('swipedown!!');
      this.events.publish('event:swipe','down');

    })

  }

  ngOnDestroy() {
    this.swipeGesture.destroy()
  }
}

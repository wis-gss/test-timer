import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  public title: string;
  public isStarted: boolean;
  public isWaiting: boolean;
  public currentTime: string;

  public timer: {
    seconds: number,
    time: string
  };

  private _currentTimeSub: Subscription;
  private _timerSub: Subscription;

  constructor() {
    this.title = 'test timer app';
    this.isStarted = false;
    this.isWaiting = false;
  }

  public ngOnInit() {
    this.initTimerTime();
    this.subscribe();
  }

  public ngOnDestroy() {
    this._currentTimeSub && this._currentTimeSub.unsubscribe();
    this._timerSub && this._timerSub.unsubscribe();
  }

  private subscribe() {
    this._currentTimeSub = Observable
      .interval(1000)
      .subscribe(() => {
        this.time();
      });
  }

  /**
   * Default initialization of Timer
   */
  private initTimerTime() {
    this.timer = {
      seconds: 0,
      time: '00:00:00'
    };
  }

  /**
   * View current time
   */
  private time() {
    let d = new Date();

    this.currentTime = this.setZeros(d.getHours(), d.getMinutes(), d.getSeconds());
  }

  /**
   * Start & Stop of timer
   * in case Start - clears last time values and start counting new
   * in case Stop - stops counting of time
   */
  public startStop() {
    if (this.isStarted) {
      this._timerSub && this._timerSub.unsubscribe();
    } else {
      this.initTimerTime();
      this.start();
    }

    this.isStarted = !this.isStarted;

    this.isWaiting = false;
  }

  public wait() {
    console.log('wait');
    if (this.isWaiting) {
      this.start();
    } else {
      this._timerSub && this._timerSub.unsubscribe();
    }

    this.isWaiting = !this.isWaiting;
  }

  /**
   * Reset timer to 0
   */
  public reset() {
    this.initTimerTime();
  }

  /**
   * Start of timer
   */
  private start() {
    this._timerSub = Observable
      .interval(1000)
      .subscribe(() => {
        this.timer.seconds++;

        let seconds = this.timer.seconds;

        let hours = Math.floor(seconds / 360);
        seconds -= hours * 360;
        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        this.timer.time = this.setZeros(hours, minutes, seconds);
      });
  }

  /**
   * Add 0 before hours/minutes/seconds if it needed
   * @param {number | string} hours
   * @param {number | string} minutes
   * @param {number | string} seconds
   * @returns {string}
   */
  private setZeros(hours: number | string, minutes: number | string, seconds: number | string): string {
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
  }
}

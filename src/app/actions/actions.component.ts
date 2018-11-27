import { Component, OnInit } from '@angular/core';
import { ActionService } from '../shared/services/action.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { SubscriptionsManager } from '../shared/model/SubscriptionsManager';
import { TableValue, TableValueSearchable } from '../shared/model/TableValue';
import {Subscription} from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent extends SubscriptionsManager implements OnInit {
  startTime: Moment;
  timeLog: string;
  counterSubscription: Subscription;
  findNumbers: Array<number> = [];

  constructor(private actionService: ActionService) {
    super();
  }

  ngOnInit() {
    this.autoUnsubscribe(this.actionService.findCellsStream.subscribe((findNumbers: Array<TableValueSearchable>) => {
      this.findNumbers = findNumbers.map((value: TableValue) => value.n);
    }));

    this.autoUnsubscribe(this.actionService.completeStream.subscribe(() => {
      this.stop();
    }));
  }

  start(): void {
    this.actionService.startStream.next();
    this.startTime = moment();
    this.initTimeCounter();
    this.counterSubscription = interval(1000).subscribe(() => {
      this.initTimeCounter();
    });
  }

  stop(): void {
    this.actionService.stopStream.next(this.timeLog);
    this.clear();
  }

  clear(): void {
    this.findNumbers = [];
    this.startTime = null;
    this.timeLog = null;
    this.counterSubscription.unsubscribe();
  }

  initTimeCounter() {
    const now = moment();
    this.timeLog = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.startTime, 'DD/MM/YYYY HH:mm:ss'))).format('mm:ss');
  }
}

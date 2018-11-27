import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export class SubscriptionsManager implements OnDestroy {
  subscriptions: Array<Subscription> = [];

  autoUnsubscribe(s: Subscription): void {
    this.subscriptions.push(s);
  }

  ngOnDestroy() {
    this.subscriptions.map((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subscriptions = [];
  }
}













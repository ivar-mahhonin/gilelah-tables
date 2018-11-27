import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TableValue} from '../../shared/model/TableValue';
import {ActionService} from '../../shared/services/action.service';
import {SubscriptionsManager} from '../../shared/model/SubscriptionsManager';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent extends SubscriptionsManager implements OnInit, OnChanges {
  @Input() value: TableValue;
  @Input() gameStarted = false;
  activeValue: string | number;
  correctlySelected = false;
  wronglySelected = false;

  constructor(private actionService: ActionService) {
    super();
  }

  ngOnInit() {
    this.showHiddenValue();

    this.autoUnsubscribe(this.actionService.wrongSelectionStream.pipe(filter((value: TableValue) => value.n === this.value.n))
      .subscribe(() => {
        this.markRed();
      }));

    this.autoUnsubscribe(this.actionService.correctSelectionStream.pipe(filter((value: TableValue) => value.n === this.value.n))
      .subscribe(() => {
        this.markGreen();
      }));
  }

  clearSelection(): void {
    this.wronglySelected = false;
    this.correctlySelected = false;
  }

  showHiddenValueAfterTimeout(): void {
    setTimeout(() => {
      this.clearSelection();
      this.showHiddenValue();
    }, 1000);
  }

  markRed(): void {
    this.wronglySelected = true;
    this.showRealValue();
    this.showHiddenValueAfterTimeout();
  }

  markGreen(): void {
    this.correctlySelected = true;
    this.showRealValue();
    this.showHiddenValueAfterTimeout();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  showRealValue() {
    if (this.value) {
      this.activeValue = this.value.n;
    }
  }

  showHiddenValue() {
    if (this.value) {
      this.activeValue = this.value.val;
    }
  }
}

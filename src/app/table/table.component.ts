import { TableValue } from './../shared/model/TableValue';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionsManager } from '../shared/model/SubscriptionsManager';
import { ActionService } from '../shared/services/action.service';
import { TableValueSearchable } from '../shared/model/TableValue';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends SubscriptionsManager implements OnInit {
  @Input() rows;
  @Input() columns;
  @Input() chunkedNumberRange: Array<Array<TableValue>>;
  @Input() tdFontSize: string;

  findNumbers: Array<TableValueSearchable> = [];
  searchableValue: TableValueSearchable;
  gameStarted = false;
  @ViewChild('tableTd') elementView: ElementRef;

  constructor(private actionService: ActionService) {
    super();
  }

  ngOnInit() {
    this.autoUnsubscribe(this.actionService.rangeNumbersStream.subscribe((findNumbers: Array<TableValue>) => {
      this.findNumbers = sortBy(findNumbers.map((v) => new TableValueSearchable(v.n, v.val)), ((tvs) => tvs.n));
      this.initNewSearchableValue();
    }));

    this.autoUnsubscribe(this.actionService.selectedCellStream.subscribe((selectedNumberValue: TableValue) => {
      this.updateFoundNumbers(selectedNumberValue);
    }));

    this.autoUnsubscribe(this.actionService.gameStarted.subscribe((status: boolean) => {
      this.gameStarted = status;
    }));
  }

  onCellClick(value: TableValue): void {
    if (this.gameStarted) {
      this.actionService.selectedCellStream.next(value);
    }
  }

  getNextSearchableValue(): TableValueSearchable {
    return this.findNumbers.filter((n) => !n.found)[0];
  }

  updateExistingSearchableValue(value: number): void {
    const searchable: TableValueSearchable = this.findNumbers.find((n: TableValueSearchable) => n.n === value);
    searchable.found = true;
  }

  updateFoundNumbers(value: TableValue): void {
    if (this.searchableValue.n === value.n) {
      this.updateExistingSearchableValue(value.n);
      const allNumbersFound: boolean = this.findNumbers.every((n) => n.found);
      if (allNumbersFound) {
        this.actionService.completeStream.next();
      } else {
        this.initNewSearchableValue();
        this.actionService.correctSelectionStream.next(value);
      }
    } else {
      this.actionService.wrongSelectionStream.next(value);
    }
  }

  initNewSearchableValue(): void {
    this.searchableValue = this.getNextSearchableValue();
    if (this.searchableValue) {
      this.actionService.findCellsStream.next([this.searchableValue]);
    } else {
      this.clearState();
      this.actionService.completeStream.next();
    }
  }

  clearState(): void {
    this.findNumbers = [];
    this.searchableValue = null;
    this.gameStarted = false;
  }
}

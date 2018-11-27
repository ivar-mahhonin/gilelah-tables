import { TableValue, TableValueSearchable } from './../model/TableValue';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class ActionService {
  stopStream: Subject<string> = new Subject<string>();
  startStream: Subject<void> = new Subject<void>();
  selectedCellStream: Subject<TableValue> = new Subject<TableValue>();
  rangeNumbersStream: Subject<Array<TableValue>> = new Subject<Array<TableValue>>();
  foundCellsStream: Subject<Array<TableValue>> = new Subject<Array<TableValue>>();
  findCellsStream: Subject<Array<TableValue>> = new Subject<Array<TableValueSearchable>>();
  completeStream: Subject<void> = new Subject<void>();
  wrongSelectionStream: Subject<TableValue> = new Subject<TableValue>();
  correctSelectionStream: Subject<TableValue> = new Subject<TableValue>();
  gameStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

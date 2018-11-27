import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { range } from 'lodash';

export enum TableMode {
  SIMPLE_NUMBERS = 0,
  MATH_OPERATIONS = 1,
  LINEAR_EQUATION = 2,
  QUADRATIC_EQUATION = 3
}

export class StartEmitter {
  selectedMode: string;
  selectedSize: number;
}

@Component({
  selector: 'app-ask-modal',
  templateUrl: './ask-modal.component.html',
  styleUrls: ['./ask-modal.component.scss']
})
export class AskModalComponent {
  modes = ['Simple numbers', 'Math operations', 'Equations', 'Quadratic equations'];
  rangeChoice: Array<number> = range(2, 11);
  selectedMode: number;
  selectedSize;
  @Input() title: string;
  @Output() startEmitter: EventEmitter<StartEmitter> = new EventEmitter<StartEmitter>();

  constructor(public activeModal: NgbActiveModal) {
  }

  start(): void {
    this.startEmitter.emit({selectedMode: TableMode[this.selectedMode], selectedSize: this.selectedSize});
    this.activeModal.close();
  }

  selectMode(index: number): void {
    this.selectedMode = index;
  }

  selectSize(index: number): void {
    this.selectedSize = this.rangeChoice[index];
  }
}

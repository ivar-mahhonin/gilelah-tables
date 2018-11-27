import {TableValue} from './shared/model/TableValue';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {range, chunk, shuffle, random} from 'lodash';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AskModalComponent, StartEmitter, TableMode} from './ask-modal/ask-modal.component';
import {ActionService} from './shared/services/action.service';
import {SubscriptionsManager} from './shared/model/SubscriptionsManager';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionsManager implements OnInit {
  end: number;
  square: number;
  rows: Array<number>;
  columns: Array<number>;
  numbersRange: Array<TableValue>;
  chunkedNumberRange: Array<Array<TableValue>>;
  mode: string;
  startStream: BehaviorSubject<StartEmitter> = new BehaviorSubject({selectedMode: TableMode[1], selectedSize: 3});

  mathOperations = ['diff', 'summ'];
  tdFontSize: string;

  tableTdFontSizeSettingsObject = {
    MATH_OPERATIONS: {
      2: '7vh',
      3: '5vh',
      4: '3vh',
      5: '2.6vh',
      6: '2.4vh',
      7: '2vh',
      8: '1.7vh',
      9: '1.4vh',
      10: '1.3vh'
    },
    LINEAR_EQUATION: {
      2: '5vh',
      3: '4vh',
      4: '3vh',
      5: '2.5vh',
      6: '2vh',
      7: '1.4vh',
      8: '1.2vh',
      9: '1.1h',
      10: '1vh'
    },
    QUADRATIC_EQUATION: {
      2: '4vh',
      3: '3vh',
      4: '2vh',
      5: '1.4vh',
      6: '1.1vh',
      7: '1.4vh',
      8: '1.2vh',
      9: '1.1h',
      10: '1vh'
    }
  };

  constructor(private modalService: NgbModal,
              private cd: ChangeDetectorRef,
              private actionService: ActionService) {
    super();
    this.initActionServiceSubscriptions();
  }

  ngOnInit() {
    this.initStartStreamSubscriptions();
    setTimeout(() => {
      this.openModal();
    }, 500);
  }

  initStartStreamSubscriptions(): void {
    this.autoUnsubscribe(this.startStream.subscribe((emit: StartEmitter) => {
      this.rows = [];
      this.columns = [];
      this.chunkedNumberRange = [];
      this.initTable(emit.selectedSize, emit.selectedMode);
      this.cd.detectChanges();
    }));
  }

  initActionServiceSubscriptions(): void {
    this.autoUnsubscribe(this.actionService.startStream.subscribe(() => {
      this.actionService.rangeNumbersStream.next(this.numbersRange);
      this.actionService.gameStarted.next(true);
    }));

    this.autoUnsubscribe(this.actionService.stopStream.subscribe((timeLog: string) => {
      this.actionService.gameStarted.next(false);
      this.openModal(`Your score is ${timeLog}!`);
    }));
  }

  calculateTdFontSize(mode: string, size: number) {
    if (mode === TableMode[0]) {
      this.tdFontSize = `${85 / this.columns.length / 2}vh`;
    } else {
      this.tdFontSize = this.tableTdFontSizeSettingsObject[mode][size];
    }
  }


  initTable(size: number, mode: string) {
    this.end = size * size;
    this.square = Math.sqrt(this.end);
    this.rows = range(0, Math.sqrt(this.end));
    this.columns = range(0, Math.sqrt(this.end));
    this.numbersRange = shuffle(range(1, this.end + 1)).map(n => {
      return {n: n, val: n.toString()} as TableValue;
    });

    this.calculateTdFontSize(mode, size);

    if (mode === TableMode[0]) {
      this.initSimpleNumbersMode();
    }
    if (mode === TableMode[1]) {
      this.initMathOperationsMode();
    }
    if (mode === TableMode[2]) {
      this.initEquationsMode();
    }
    if (mode === TableMode[3]) {
      this.initQuadraticEquationsMode();
    }
    this.mode = mode;
  }

  initSimpleNumbersMode(): void {
    this.chunkedNumberRange = chunk(this.numbersRange, this.square);
  }

  initMathOperationsMode(): void {
    const numbersRangeMappedToMathOperations = this.numbersRange
      .map((value: TableValue) => this.convertNumberToMathOperationsString(value));
    this.chunkedNumberRange = chunk(numbersRangeMappedToMathOperations, this.square);
  }

  initEquationsMode(): void {
    const numbersRangeMappedToMathOperations = this.numbersRange
      .map((value: TableValue) => this.convertNumberToEquationString(value));
    this.chunkedNumberRange = chunk(numbersRangeMappedToMathOperations, this.square);
  }

  initQuadraticEquationsMode(): void {
    const numbersRangeMappedToMathOperations = this.numbersRange
      .map((value: TableValue) => this.convertNumberToQuadraticEquationString(value));
    this.chunkedNumberRange = chunk(numbersRangeMappedToMathOperations, this.square);
  }

  convertNumberToQuadraticEquationString(value: TableValue): TableValue {
    const n: number = value.n;
    const randomNUmber = random(n + 2, 20);

    const part1 = randomNUmber - n;
    const part2 = randomNUmber * n;

    const op = `x² ${part1 > 0 ? '+' : ''} ${part1}x - ${part2}=0`;
    return {n: n, val: op};
  }

  convertNumberToEquationString(value: TableValue): TableValue {
    const randomOperation = this.getRandomMathOperation();
    const n: number = value.n;
    const variableLetter: string = this.getRandomCharacter();
    if (randomOperation === 'summ') {
      const second = random(1, 10);
      const operators = shuffle([variableLetter, second]).join(' + ');
      const op = `${operators} = ${second + n}`;
      return {n: n, val: op};
    }

    if (randomOperation === 'diff') {
      const second = random(1, 10);
      const op = `${this.getRandomCharacter()} - ${second} = ${n - second}`;
      return {n: n, val: op};
    }
  }

  convertNumberToMathOperationsString(value: TableValue): TableValue {
    const randomOperation = this.getRandomMathOperation();
    const n = value.n;

    if (randomOperation === 'summ') {
      const first = random(1, n);
      const second = n - first;
      const op = `${first} + ${second}`;
      return {n: n, val: op};
    }

    if (randomOperation === 'diff') {
      const randomNumber = random(1, n);
      const first = n + randomNumber;
      const op = `${first} - ${randomNumber}`;
      return {n: n, val: op};
    }
  }

  getRandomMathOperation(): string {
    return this.mathOperations[random(0, this.mathOperations.length - 1)];
  }

  openModal(title?: string) {
    const boundedStream = this.init.bind(this);
    const modalRef = this.modalService.open(AskModalComponent);
    modalRef.componentInstance.startEmitter.subscribe((res: StartEmitter) => boundedStream(res));
    if (title) {
      modalRef.componentInstance.title = title;
    }
  }

  init(res: StartEmitter) {
    this.startStream.next(res);
  }

  getRandomCharacter(): string {
    const chars: Array<string> = 'abcdefghijklmnøpqurstuvwxyz'.split('');
    return chars[random(0, chars.length - 1)];
  }
}


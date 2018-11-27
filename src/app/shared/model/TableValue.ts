export class TableValue {
  n: number;
  val: string;
}

export class TableValueSearchable extends TableValue {
  found = false;

  constructor(n: number, val: string) {
    super();
    this.n = n;
    this.val = val;
  }
}

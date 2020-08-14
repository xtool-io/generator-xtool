import { UdfExpression } from './udf-expression';

export abstract class UdfPredicate extends UdfExpression {

  constructor(
    public dataField: string,
    op: string,
    public value: any) {
    super()
    this.type = op;
  }

  toArray(): any[] {
    return [this.dataField, this.type, this.value];
  }

}

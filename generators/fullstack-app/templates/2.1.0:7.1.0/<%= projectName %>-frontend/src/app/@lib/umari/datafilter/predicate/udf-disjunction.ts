import { UdfFilterable } from './../core/udf-filterable';
import { UdfExpression } from './udf-expression';

export class UdfDisjunction extends UdfFilterable {
  type = 'or';

  constructor(
    predicates?: UdfExpression[]
  ) {
    super();
    if (predicates)
      this.concatPredicates(predicates);
  }

}

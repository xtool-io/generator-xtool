import { UdfExpression } from './../predicate/udf-expression';

/**
 * Expressão do filtro usada para fazer o request à um endpoint
 * findAll() do pacote Udf, podendo ela ser simples ou complexa
 */
export class UdfFilterable extends UdfExpression {

  predicates: UdfExpression[] = [];

  concatPredicates(predicates: UdfExpression[]) {
    predicates.forEach((p: UdfExpression) => {
      if (p instanceof UdfFilterable && p.predicates.length === 1) this.predicates.push(p.predicates[0]);
      else if (p instanceof UdfFilterable && p.type === this.type) this.concatPredicates(p.predicates);
      else this.predicates.push(p);
    });
  }

  toQueryParam(): string {
      return this.predicates
        .map((p: UdfExpression) => p instanceof UdfFilterable ? `(${p.toQueryParam()})` : p.toQueryParam())
        .join(this.type === 'and' ? ';' : ',');
  }

  toArray(): any[] {
    let predicates: any[] = [];
    this.predicates
      .map((p: UdfExpression) => p instanceof UdfFilterable ? [ p.toArray() ] : p.toArray())
      .forEach((p: any[]) => {
        predicates.push(p);
        predicates.push(this.type)
      });
      predicates.pop()
      return predicates;
  }

}

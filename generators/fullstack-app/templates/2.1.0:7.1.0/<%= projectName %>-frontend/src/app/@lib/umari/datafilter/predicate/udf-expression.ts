/**
 * Expressão simples usada como parte do filtro
 */
export abstract class UdfExpression {

  type?: string;

  abstract toQueryParam(): string;

  abstract toArray(): any[];

}

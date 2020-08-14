import { UdfGreaterOrEquals } from './../predicate/udf-greater-or-equals';
import { UdfLessOrEquals } from './../predicate/udf-less-or-equals';
import { UdfDisjunction } from './../predicate/udf-disjunction';
import { UdfConjunction } from './../predicate/udf-conjunction';
import { UdfNotContains } from './../predicate/udf-not-contains';
import { UdfExpression } from './../predicate/udf-expression';
import { UdfNotEquals } from './../predicate/udf-not-equals';
import { UdfContains } from './../predicate/udf-contains';
import { UdfGreater } from './../predicate/udf-greater';
import { UdfEquals } from './../predicate/udf-equals';
import { UdfLess } from './../predicate/udf-less';

export enum Value {
  NOW = '@now',
  NULL = '@null',
  NOT_NULL = '@notnull'
}

export class UdfBuilder {

  //========================================
  // FUNCOES BUILDERS DE EXPRESSOES LOGICAS
  //========================================

  /**
   * Constrói uma expressão lógica que uni múltiplos predicados através de uma conjunção
   * 
   * @param predicates 
   */
  and(...predicates: UdfExpression[]): UdfConjunction {
    return new UdfConjunction(predicates);
  }

  /**
   * Constrói uma expressão lógica que uni múltiplos predicados através de uma disjunção
   * 
   * @param predicates 
   */
  or(...predicates: UdfExpression[]): UdfDisjunction {
    return new UdfDisjunction(predicates);
  }

  //================================
  // FUNCOES BUILDERS DE PREDICADOS
  //================================

  /**
   * Constrói um novo predicado com comparador 'equals to'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  eq(field: string, value: any): UdfEquals {
    return new UdfEquals(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'not equals to'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  ne(field: string, value: any): UdfNotEquals {
    return new UdfNotEquals(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'contains'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  contains(field: string, value: string): UdfContains {
    return new UdfContains(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'not contains'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  notcontains(field: string, value: string): UdfNotContains {
    return new UdfNotContains(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'greater than'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  gt(field: string, value: Date | number | Value.NOW): UdfGreater {
    return new UdfGreater(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'greater than or equals to'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  ge(field: string, value: Date | number | Value.NOW): UdfGreaterOrEquals {
    return new UdfGreaterOrEquals(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'less than'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  lt(field: string, value: Date | number | Value.NOW): UdfLess {
    return new UdfLess(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'less than or equals to'
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  le(field: string, value: Date | number | Value.NOW): UdfLessOrEquals {
    return new UdfLessOrEquals(field, value);
  }

  /**
   * Constrói um novo predicado com comparador 'equals to' e valor NULL
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  isblank(field: string): UdfEquals {
    return new UdfEquals(field, Value.NULL);
  }

  /**
   * Constrói um novo predicado com comparador 'not equals to' e valor NULL
   * 
   * @param field atributo para a comparação
   * @param value valor para a comparação
   */
  isnotblank(field: string): UdfNotEquals {
    return new UdfNotEquals(field, Value.NULL);
  }

}
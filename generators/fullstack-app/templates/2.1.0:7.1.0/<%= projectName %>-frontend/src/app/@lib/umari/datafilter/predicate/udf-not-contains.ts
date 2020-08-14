import { UdfPredicate } from './udf-predicate';

export class UdfNotContains extends UdfPredicate {

    constructor(
        dataField: string,
        value: string
    ) {
        super(dataField, 'notcontains', value)
    }

    toQueryParam(): string {
        return `${this.dataField}!=*${this.value}*`;
    }

}

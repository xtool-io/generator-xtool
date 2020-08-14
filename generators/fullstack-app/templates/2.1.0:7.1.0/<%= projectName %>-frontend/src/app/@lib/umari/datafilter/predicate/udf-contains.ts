import { UdfPredicate } from './udf-predicate';

export class UdfContains extends UdfPredicate {

    constructor(
        dataField: string,
        value: string
    ) {
        super(dataField, 'contains', value)
    }

    toQueryParam(): string {
        return `${this.dataField}==*${this.value}*`;
    }

}

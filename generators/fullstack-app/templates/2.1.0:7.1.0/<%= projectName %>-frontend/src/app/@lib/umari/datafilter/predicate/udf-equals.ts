import { UdfPredicate } from './udf-predicate';

export class UdfEquals extends UdfPredicate {

    constructor(
        dataField: string,
        value: any
    ) {
        super(dataField, '=', value)
    }

    toQueryParam(): string {
        return `${this.dataField}==${this.valueToString()}`;
    }

    private valueToString(): string {
        if (this.value instanceof Date) return this.value.toISOString().substr(0, 19);
        return this.value
    }

}

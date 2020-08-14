import { UdfPredicate } from './udf-predicate';
import { Value } from './../filter/udf-builder';

export class UdfGreaterOrEquals extends UdfPredicate {

    constructor(
        dataField: string,
        value: number | Date | Value.NOW
    ) {
        super(dataField, '>=', value)
    }

    toQueryParam(): string {
        return `${this.dataField}>=${this.valueToString()}`;
    }

    private valueToString(): string {
        if (this.value instanceof Date) return this.value.toISOString().substr(0, 19);
        return this.value.toString();
    }

}

import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadOptions } from 'devextreme/data/load_options';
import { of } from 'rxjs';
import CustomStore from 'devextreme/data/custom_store';

import { UdfStoreOptions } from './udf-store-options';
import { UdfDisjunction } from './../datafilter/predicate/udf-disjunction';
import { UdfAggregation } from './../datafilter/core/udf-aggregation';
import { UdfFilterable } from './../datafilter/core/udf-filterable';
import { toFilterable } from './../datafilter/filter/udf-parser';
import { environment } from './../../../../environments/environment';
import { UdfBuilder } from './../datafilter/filter/udf-builder';
import { Page } from './../datafilter/core/page';

const ub: UdfBuilder = new UdfBuilder();

/**
 * Store para ser usado nos DataSouces que deve receber no seu construtor:
 * 
 * - http: HttpClient (usado para fazer as requisições ao servidor)
 * - basePath: string (raíz dos endpoints rest onde os requests serão feitos)
 * - options: UdfStoreOptions (configurações específicas dos requests)
 * 
 * Apenas options é opcional
 * 
 * ---
 * Atributos
 * 
 * - onLoad: EventEmitter (é emitido ao final do load, quando as variáveis do Store são atualizados)
 * - sortParams: string (parâmetros de ordenação usados no request do último load)
 * - filter: UdfFilterable (filtro usado no request do último load)
 * - aggregations: UdfAggregation[] (agregações resultadas do último load)
 * 
 * ---
 * Métodos
 * 
 * - getSummary(dataField?, operation?): UdfAggregation[] (retorna as agregações resultadas do último load com filtros opcionais)
 * 
 */
export class UdfStore<T> extends CustomStore {

    /** EventEmitter emitido ao final do load, quando as variáveis do Store são atualizados */
    onLoad: EventEmitter<any> = new EventEmitter<any>();

    /** Parâmetros de ordenação usados no request do último load do Store */
    sortParams: string;
    /** Filtro usado no request do último load do Store */
    filter: UdfFilterable;
    /** Agregações resultadas do último load do Store */
    aggregations: UdfAggregation[];
    /** Quantidade total de elementos obtida no ultimo load */
    totalElements: number;

    constructor(
        /** Usado para fazer as requisições ao servidor, e deve ser uma depenência injetada do Componente que instanciar o Store */
        http: HttpClient,
        /** Caminho raíz dos endpoints rest onde os requests serão feitos pelo Store */
        basePath: string,
        /** UdfStoreOptions contendo configurações específicas dos requests que serão feitos pelo Store */
        options: UdfStoreOptions = new UdfStoreOptions()
    ) {
        super({
            key: options.key === undefined ? 'id' : options.key,
            byKey: (key) => {
                if (options.key === null) return key;
                return http.get<T>(this.byKeyUrl(options, basePath, key))
                    .toPromise()
                    .catch(error => { throw new Error(error.error.message); });
            },
            load: async (loadOptions: LoadOptions) => {
                // console.log(basePath, options, loadOptions);
                let returnData: { data?, totalCount?, summary? } = {};
                await http.get<Page<T>>(this.loadUrl(loadOptions, options, basePath))
                    .toPromise()
                    .then((page: Page<T>) => {
                        this.updateStoreVariables(loadOptions, page);
                        returnData.data = page.content;
                        returnData.totalCount = page.totalElements;
                    })
                    .catch(error => { throw new Error(error.error.message); });
                if (loadOptions.totalSummary)
                    await http.post<UdfAggregation[]>(this.loadSummaryUrl(loadOptions, options, basePath), loadOptions.totalSummary)
                        .toPromise()
                        .then((aggregations: UdfAggregation[]) => {
                            this.aggregations = aggregations;
                            returnData.summary = aggregations.map(agg => agg.result);
                        })
                        .catch(error => { throw new Error(error.error.message); });
                return of(returnData).toPromise();
            }
        });
    }

    /**
     * Retorna a string referente a URL que deve ser usada para o request do byKey (findOne)
     * 
     * @param options
     * @param basePath
     * @param key
     */
    private byKeyUrl(options: UdfStoreOptions, basePath: string, key: any): string {
        return `${environment.urlbase}${options.endpoints.byKey || basePath}/${key}`;
    }

    /**
     * Retorna a string referente a URL que deve ser usada para o request do load (findAll)
     * 
     * @param loadOptions 
     * @param options 
     * @param basePath 
     */
    private loadUrl(loadOptions: LoadOptions, options: UdfStoreOptions, basePath: string): string {
        let params = this.paramsFromLoadOptions(loadOptions);
        return `${environment.urlbase}${options.endpoints.load || basePath}${params}`;
    }
    /**
     * Retorna a string referente a URL que deve ser usada para o request de summary do load (aggregate)
     * 
     * @param loadOptions 
     * @param options 
     * @param basePath 
     */
    private loadSummaryUrl(loadOptions: LoadOptions, options: UdfStoreOptions, basePath: string): string {
        let params = '',
            filterable = this.filterableFromLoadOptions(loadOptions);
        if (filterable) params += `?q=${filterable.toQueryParam()}`;
        return `${environment.urlbase}${options.endpoints.load || basePath}/agg${params}`;
    }

    /**
     * Retorna a string referente aos parâmetros que devem ser usado no request do load (findAll)
     * 
     * @param loadOptions 
     */
    private paramsFromLoadOptions(loadOptions: LoadOptions): string {
        let skip = loadOptions.skip,
            take = loadOptions.take,
            page = skip ? (skip / take) : 0,
            params = `?page=${page}&size=${take}`,
            filterable = this.filterableFromLoadOptions(loadOptions);
        if (loadOptions.sort) params += `&${this.paramFromSort(loadOptions.sort)}`;
        if (loadOptions.select) params += `&fields=${loadOptions.select.join(',')}`;
        if (filterable) params += `&q=${filterable.toQueryParam()}`;
        return params;
    }

    /**
     * Retorna um filterable referente ao filtro que deve ser usado
     * 
     * @param loadOptions
     */
    private filterableFromLoadOptions(loadOptions: LoadOptions): UdfFilterable {
        let searchExpr = loadOptions.searchExpr as string | string[],
            searchOperation = loadOptions.searchOperation,
            searchValue = loadOptions.searchValue,
            filter = loadOptions.filter,
            searchDisjunction = this.disjunctionFromSearch(searchExpr, searchOperation, searchValue);
        if (searchDisjunction) {
            if (filter) return ub.and(filter, searchDisjunction);
            return searchDisjunction;
        }
        return toFilterable(filter);
    }

    private disjunctionFromSearch(expr: string | string[], operation: string, value: any): UdfDisjunction {
        if (!value) return null;
        if (operation === '=') {
            if (expr instanceof Array)
                return new UdfDisjunction(expr.map(e => ub.eq(e, value)));
            return ub.or(ub.eq(expr, value));
        }
        if (expr instanceof Array)
            return new UdfDisjunction(expr.map(e => ub.contains(e, value)));
        return ub.or(ub.contains(expr, value));
    }

    /**
     * Retorna a string referente ao parâmetro de ordenação
     * 
     * @param sort
     */
    private paramFromSort(sort: { selector: string, desc: boolean }[]): string {
        if (!sort) return null;
        return sort.map(order => `sort=${order.selector},${order.desc ? 'desc' : 'asc'}`).join('&');
    }

    /**
     * Atualiza as variáveis do Store
     * 
     * @param loadOptions 
     * @param aggregations
     */
    private updateStoreVariables(loadOptions: LoadOptions, page: Page<T>): void {
        this.sortParams = this.paramFromSort(loadOptions.sort);
        this.filter = this.filterableFromLoadOptions(loadOptions);
        this.totalElements = page['totalElements'];
        this.onLoad.emit();
    }

    /**
     * Método que retorna as agregações resultadas do último load do Store com filtros opcionais
     * 
     * @param dataField
     * @param operation
     */
    getSummary(dataField?: string, operation?: 'count' | 'sum' | 'max' | 'min' | 'avg'): UdfAggregation[] {
        let filteredSummary: UdfAggregation[];
        if (!dataField) return this.aggregations;
        if (operation) filteredSummary = this.aggregations
            .filter(agg => agg.dataField === dataField && agg.operation === operation);
        else filteredSummary = this.aggregations
            .filter(agg => agg.dataField === dataField);
        if (filteredSummary.length === 0) return null;
        return filteredSummary;
    }

}

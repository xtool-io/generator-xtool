/**
 * Opções de configuração do UdfStore
 * 
 * - key: string = 'id';
 * - endpoints: UdfStoreEndpoints
 * 
 * Apenas endpoints é obrigatório
 */
export class UdfStoreOptions {

    /**
     * *Opcional*
     * 
     * Chave que será usada na UdfStore, que definirá qual atributo
     * do objeto será enviado no request do byKey
     * 
     * Se não definida (key = undefined) a UdfStore condiderá o valor
     * padrão ('id'). Para tratar todo o Objeto como a Chave, e o
     * retornar no byKey, deve-se atribuir à key o valor null
     * 
     * *Dica: setar a key como null para uso em header filter,*
     * *pois ele só precisa do load, e a key causa comportamentos*
     * *estranhos nele*
     */
    key?: string = 'id';

    endpoints: UdfStoreEndpoints = {};

}

export class UdfStoreEndpoints {
    /**
     * Fragmento de URL que deve ser usado para realizar o request do byKey
     * 
     * Se não definido o byKey usa o endpoint ${path}/${key}
     */
    byKey?: string;
    /**
     * Fragmento de URL que deve ser usado para realizar o request do load
     * 
     * Se não definido o load usa o endpoint ${path}
     */
    load?: string;
}
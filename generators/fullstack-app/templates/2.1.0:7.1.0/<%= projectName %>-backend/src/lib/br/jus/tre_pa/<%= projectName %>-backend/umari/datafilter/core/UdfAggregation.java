package br.jus.tre_pa.sof.umari.datafilter.core;

/**
 * Classe que contem o resultado de uma operação de agragação em um atributo.
 */
public class UdfAggregation {

    /**
     * Nome do atributo que sofreu a operação de agragação.
     */
    private String dataField;

    /**
     * Tipo de operação de agregação.
     */
    private UdfAggregable.Operation operation;

    /**
     * Resultado da operação de agregação no atributo.
     */
    private Object result;

    public UdfAggregation(String dataField, Object result, UdfAggregable.Operation operation) {
        super();
        this.dataField = dataField;
        this.result = result;
        this.operation = operation;
    }

    public String getDataField() {
        return this.dataField;
    }

    public UdfAggregable.Operation getOperation() {
        return this.operation;
    }

    public Object getResult() {
        return this.result;
    }

    public void setDataField(String dataField) {
        this.dataField = dataField;
    }

    public void setOperation(UdfAggregable.Operation operation) {
        this.operation = operation;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    public String toString() {
        return "AggregationResult(dataField=" + this.getDataField() + ", operation=" + this.getOperation() + ", result=" + this.getResult() + ")";
    }
}

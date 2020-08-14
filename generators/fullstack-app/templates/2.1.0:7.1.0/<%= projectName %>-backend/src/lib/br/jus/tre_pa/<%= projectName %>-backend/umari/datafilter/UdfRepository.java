package br.jus.tre_pa.sof.umari.datafilter;

import br.jus.tre_pa.sof.umari.datafilter.core.UdfAggregable;
import br.jus.tre_pa.sof.umari.datafilter.core.UdfAggregation;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface UdfRepository<T> {

    List<UdfAggregation> aggregate(Class<T> entityClass, List<UdfAggregable> aggregables, Specification<T> specification);
}

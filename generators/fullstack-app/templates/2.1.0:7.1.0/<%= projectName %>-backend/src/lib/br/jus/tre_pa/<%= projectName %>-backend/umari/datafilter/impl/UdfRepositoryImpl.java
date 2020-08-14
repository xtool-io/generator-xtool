package br.jus.tre_pa.sof.umari.datafilter.impl;

import br.jus.tre_pa.sof.umari.datafilter.UdfRepository;
import br.jus.tre_pa.sof.umari.datafilter.core.UdfAggregable;
import br.jus.tre_pa.sof.umari.datafilter.core.UdfAggregation;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Tuple;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.*;
import java.util.function.Function;

@Repository
@Transactional(readOnly = true)
public class UdfRepositoryImpl<T> implements UdfRepository<T> {

    @PersistenceContext
    private EntityManager em;

    /**
     * Mapa com os definições de código das operações de agregação.
     */
    private Map<UdfAggregable.Operation, Function<Triple<String, Root<?>, CriteriaBuilder>, Expression<? extends Number>>> operationsDef = new HashMap<>();

    @PostConstruct
    private void init() {
        operationsDef.put(UdfAggregable.Operation.DCOUNT, t -> t.getRight().countDistinct(t.getMiddle().get(t.getLeft())));
        operationsDef.put(UdfAggregable.Operation.COUNT, t -> t.getRight().count(t.getMiddle().get(t.getLeft())));
        operationsDef.put(UdfAggregable.Operation.SUM, t -> t.getRight().sum(t.getMiddle().get(t.getLeft())));
        operationsDef.put(UdfAggregable.Operation.MIN, t -> t.getRight().min(t.getMiddle().get(t.getLeft())));
        operationsDef.put(UdfAggregable.Operation.MAX, t -> t.getRight().max(t.getMiddle().get(t.getLeft())));
        operationsDef.put(UdfAggregable.Operation.AVG, t -> t.getRight().avg(t.getMiddle().get(t.getLeft())));
    }

    @Override
    public List<UdfAggregation> aggregate(Class<T> entityClass, List<UdfAggregable> aggregables, Specification<T> specification) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<T> root = cq.from(entityClass);
        prepareSelect(root, cq, cb, aggregables);
        prepareWhere(entityClass, root, cq, cb, specification);
        return createAggregations(aggregables, cq);
    }

    private void prepareSelect(Root<T> root, CriteriaQuery<?> cq, CriteriaBuilder cb, List<UdfAggregable> aggregables) {
        Selection[] selections = aggregables
                .stream()
                .map(agg -> operationsDef.get(agg.getOperation()).apply(Triple.of(agg.getDataField(), root, cb)))
                .toArray(Selection[]::new);
        cq.multiselect(selections);
    }

    private void prepareWhere(Class<T> entityClass, Root<T> root, CriteriaQuery<?> cq, CriteriaBuilder cb, Specification<T> specification) {
        if (Objects.nonNull(specification) && Objects.nonNull(specification.toPredicate(root, cq, cb))) {
            cq.where(specification.toPredicate(root, cq, cb));
        }
    }


    private List<UdfAggregation> createAggregations(List<UdfAggregable> aggregables, CriteriaQuery<Tuple> cq) {
        TypedQuery<Tuple> query = em.createQuery(cq);
        Tuple tuple = query.getSingleResult();
        List<UdfAggregation> udfAggregations = new ArrayList<>();
        for (int i = 0; i < tuple.getElements().size(); i++) {
            udfAggregations.add(new UdfAggregation(aggregables.get(i).getDataField(), tuple.get(i), aggregables.get(i).getOperation()));
        }
        return udfAggregations;
    }

}

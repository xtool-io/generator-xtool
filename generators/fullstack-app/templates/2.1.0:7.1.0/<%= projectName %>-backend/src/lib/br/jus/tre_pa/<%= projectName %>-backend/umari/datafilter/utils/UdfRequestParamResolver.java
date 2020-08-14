package br.jus.tre_pa.sof.umari.datafilter.utils;

import br.jus.tre_pa.sof.umari.datafilter.rsql.CustomRsqlVisitor;
import cz.jirutka.rsql.parser.RSQLParser;
import org.springframework.core.MethodParameter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.annotation.RequestParamMethodArgumentResolver;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Objects;

public class UdfRequestParamResolver extends RequestParamMethodArgumentResolver {

    public UdfRequestParamResolver(boolean useDefaultResolution) {
        super(useDefaultResolution);
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(UdfRequestParam.class);
    }

    @Override
    protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) throws Exception {
        UdfRequestParam udfRequestParam = parameter.getParameterAnnotation(UdfRequestParam.class);
        String filter = request.getParameter(udfRequestParam.value());
        if (Objects.nonNull(filter)) {
            return new RSQLParser().parse(filter).accept(new CustomRsqlVisitor());
        }
//        return super.resolveName(name, parameter, request);
        return new Specification() {
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return null;
            }
        };
    }
}

package br.jus.tre_pa.sof.umari.datafilter.rsql;

import br.jus.tre_pa.sof.umari.datafilter.utils.TemporalUtils;
import cz.jirutka.rsql.parser.ast.ComparisonOperator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Slf4j
@NoArgsConstructor
@AllArgsConstructor
public class GenericRsqlSpecification<T> implements Specification<T> {

    private static final long serialVersionUID = 1L;
    private String property;
    private ComparisonOperator operator;
    private List<String> arguments;

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
    	Class<? extends Object> propertyJavaType = root.get(property).getJavaType();
        List<Object> args = castArguments(root);
        Object argument = args.get(0);
        
        switch (RsqlSearchOperation.getSimpleOperator(operator)) {

            case EQUAL: {
                log.debug("EQUAL"); 
                if (argument instanceof String) {
                	if (propertyJavaType == LocalDate.class) {
                		if (argument.equals("@now")) {
                            log.debug("-- builder.equal LocalDate.now()");
                    		return builder.equal(root.get(property), LocalDate.now());
                		}
                        log.debug("-- builder.equal LocalDate");
                		return builder.equal(root.get(property), TemporalUtils.parseToLocalDate(argument));
                	}
                	if (propertyJavaType == LocalDateTime.class) {
                		if (argument.equals("@now")) {
                            log.debug("-- builder.equal LocalDateTime.now()");
                    		return builder.equal(root.get(property), LocalDateTime.now());
                		}
                        log.debug("-- builder.equal LocalDateTime");
                		return builder.equal(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
                	}
                	if (propertyJavaType == Boolean.class) {
                		if (argument.equals("true")) {
                			log.debug("-- builder.isTrue");
                			return builder.isTrue(root.get(property));
                		}
                		if (argument.equals("false")) {
                			log.debug("-- builder.isFalse");
                			return builder.isFalse(root.get(property));
                		}
                		throw new RuntimeException("Formato Booleano inválido");
                	}
                	if (propertyJavaType == BigDecimal.class) {
						log.debug("-- builder.equal BigDecimal");
						return builder.equal(root.get(property), new BigDecimal(argument.toString()));
					}
                    if (argument.equals("@null")) {
                        log.debug("-- builder.isNull");
                        return builder.isNull(root.get(property));
                    }
                    if (argument.equals("@notnull")) {
                        log.debug("-- builder.isNotNull");
                        return builder.isNotNull(root.get(property));
                    }
                    
                    log.debug("-- builder.like");
                    return builder.like(builder.upper(root.get(property)), argument.toString().replace('*', '%').toUpperCase());
                }
                    log.debug("-- builder.equal");
                    return builder.equal(root.get(property), argument);
            }
            case NOT_EQUAL: {
                log.debug("NOT_EQUAL");
                if (argument instanceof String) {
                	if (propertyJavaType == LocalDate.class) {
                		if (argument.equals("@now")) {
                            log.debug("-- builder.notEqual LocalDate.now()");
                    		return builder.notEqual(root.get(property), LocalDate.now());
                		}
                        log.debug("-- builder.notEqual LocalDate");
                		return builder.notEqual(root.get(property), TemporalUtils.parseToLocalDate(argument));
                	}
                	if (propertyJavaType == LocalDateTime.class) {
                		if (argument.equals("@now")) {
                            log.debug("-- builder.notEqual LocalDateTime.now()");
                    		return builder.notEqual(root.get(property), LocalDateTime.now());
                		}
                        log.debug("-- builder.notEqual LocalDateTime");
                		return builder.notEqual(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
                	}
                	if (propertyJavaType == Boolean.class) {
                		if (argument.equals("true")) {
                			log.debug("-- builder.isFalse");
                			return builder.isFalse(root.get(property));
                		}
                		if (argument.equals("false")) {
                			log.debug("-- builder.isTrue");
                			return builder.isTrue(root.get(property));
                		}
                	}
					if (propertyJavaType == BigDecimal.class) {
						log.debug("-- builder.notEqual BigDecimal");
						return builder.notEqual(root.get(property), new BigDecimal(argument.toString()));
					}
                    if (argument.equals("@null")) {
                        log.debug("-- builder.isNotNull");
                        return builder.isNotNull(root.get(property));
                    }
                    if (argument.equals("@notnull")) {
                        log.debug("-- builder.isNull");
                        return builder.isNull(root.get(property));
                    }
                    return builder.notLike(root.<String>get(property), argument.toString().replace('*', '%'));
                } else {
                    return builder.notEqual(root.get(property), argument);
                }
            }
            case GREATER_THAN: {
            	if (propertyJavaType == LocalDate.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.greaterThan LocalDate.now()");
                		return builder.greaterThan(root.get(property), LocalDate.now());
            		}
                    log.debug("-- builder.greaterThan LocalDate");
            		return builder.greaterThan(root.get(property), TemporalUtils.parseToLocalDate(argument));
            	}
            	if (propertyJavaType == LocalDateTime.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.greaterThan LocalDateTime.now()");
                		return builder.greaterThan(root.get(property), LocalDateTime.now());
            		}
                    log.debug("-- builder.greaterThan LocalDateTime");
            		return builder.greaterThan(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
            	}
				if (propertyJavaType == BigDecimal.class) {
					log.debug("-- builder.greaterThan BigDecimal");
					return builder.greaterThan(root.get(property), new BigDecimal(argument.toString()));
				}
                log.debug("GREATER_THAN");
                return builder.greaterThan(root.<String>get(property), argument.toString());
            }
            case GREATER_THAN_OR_EQUAL: {
            	if (propertyJavaType == LocalDate.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.greaterThanOrEqualTo LocalDate.now()");
                		return builder.greaterThanOrEqualTo(root.get(property), LocalDate.now());
            		}
                    log.debug("-- builder.greaterThanOrEqualTo LocalDate");
            		return builder.greaterThanOrEqualTo(root.get(property), TemporalUtils.parseToLocalDate(argument));
            	}
            	if (propertyJavaType == LocalDateTime.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.greaterThanOrEqualTo LocalDateTime.now()");
                		return builder.greaterThanOrEqualTo(root.get(property), LocalDateTime.now());
            		}
                    log.debug("-- builder.greaterThanOrEqualTo LocalDateTime");
            		return builder.greaterThanOrEqualTo(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
            	}
				if (propertyJavaType == BigDecimal.class) {
					log.debug("-- builder.greaterThanOrEqualTo BigDecimal");
					return builder.greaterThanOrEqualTo(root.get(property), new BigDecimal(argument.toString()));
				}
                log.debug("GREATER_THAN_OR_EQUAL");
                return builder.greaterThanOrEqualTo(root.<String>get(property), argument.toString());
            }
            case LESS_THAN: {
            	if (propertyJavaType == LocalDate.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.lessThan LocalDate.now()");
                		return builder.lessThan(root.get(property), LocalDate.now());
            		}
                    log.debug("-- builder.lessThan LocalDate");
            		return builder.lessThan(root.get(property), TemporalUtils.parseToLocalDate(argument));
            	}
            	if (propertyJavaType == LocalDateTime.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.lessThan LocalDateTime.now()");
                		return builder.lessThan(root.get(property), LocalDateTime.now());
            		}
                    log.debug("-- builder.lessThan LocalDateTime");
            		return builder.lessThan(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
            	}
				if (propertyJavaType == BigDecimal.class) {
					log.debug("-- builder.lessThan BigDecimal");
					return builder.lessThan(root.get(property), new BigDecimal(argument.toString()));
				}
                log.debug("LESS_THAN");
                return builder.lessThan(root.<String>get(property), argument.toString());
            }
            case LESS_THAN_OR_EQUAL: {
            	if (propertyJavaType == LocalDate.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.lessThanOrEqualTo LocalDate.now()");
                		return builder.lessThanOrEqualTo(root.get(property), LocalDate.now());
            		}
                    log.debug("-- builder.lessThanOrEqualTo LocalDate");
            		return builder.lessThanOrEqualTo(root.get(property), TemporalUtils.parseToLocalDate(argument));
            	}
            	if (propertyJavaType == LocalDateTime.class) {
            		if (argument.equals("@now")) {
                        log.debug("-- builder.lessThanOrEqualTo LocalDateTime.now()");
                		return builder.lessThanOrEqualTo(root.get(property), LocalDateTime.now());
            		}
                    log.debug("-- lessThanOrEqualTo.greaterThanOrEqualTo LocalDateTime");
            		return builder.lessThanOrEqualTo(root.get(property), TemporalUtils.parseToLocalDateTime(argument));
            	}
				if (propertyJavaType == BigDecimal.class) {
					log.debug("-- builder.lessThanOrEqualTo BigDecimal");
					return builder.lessThanOrEqualTo(root.get(property), new BigDecimal(argument.toString()));
				}
                log.debug("LESS_THAN_OR_EQUAL");
                return builder.lessThanOrEqualTo(root.<String>get(property), argument.toString());
            }
            case IN:
                log.debug("IN");
                return root.get(property).in(args);
            case NOT_IN:
                log.debug("NOT_IN");
                return builder.not(root.get(property).in(args));
        }

        return null;
    }
    
    private static Temporal processTemporal(Class<? extends Object> javaType, Object argument) {
    	if (javaType == LocalDate.class) {
    		if (argument.equals("@now")) {
        		return LocalDate.now();
    		}
    		return TemporalUtils.parseToLocalDate(argument);
    	}
    	if (javaType == LocalDateTime.class) {
    		if (argument.equals("@now")) {
        		return LocalDateTime.now();
    		}
    		return TemporalUtils.parseToLocalDateTime(argument);
    	}
		throw new RuntimeException("Tipo Temporal inválido");
    }

    private List<Object> castArguments(final Root<T> root) {

        Class<? extends Object> type = root.get(property).getJavaType();

        List<Object> args = arguments.stream().map(arg -> {
            if (type.equals(Integer.class)) {
                return Integer.parseInt(arg);
            } else if (type.equals(Long.class)) {
                return Long.parseLong(arg);
            } else {
                return arg;
            }
        }).collect(Collectors.toList());

        return args;
    }
}

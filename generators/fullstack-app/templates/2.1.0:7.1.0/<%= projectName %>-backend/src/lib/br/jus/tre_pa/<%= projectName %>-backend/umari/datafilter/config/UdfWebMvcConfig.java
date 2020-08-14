package br.jus.tre_pa.sof.umari.datafilter.config;

import br.jus.tre_pa.sof.umari.datafilter.utils.UdfRequestParamResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class UdfWebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new UdfRequestParamResolver(false));
    }
}

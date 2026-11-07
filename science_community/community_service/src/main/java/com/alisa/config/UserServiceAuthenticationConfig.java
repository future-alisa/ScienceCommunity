package com.alisa.config;

import com.alisa.interceptors.UserServiceAuthenticationInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UserServiceAuthenticationConfig implements WebMvcConfigurer {
    private final String userServiceUrl;

    public UserServiceAuthenticationConfig(Environment environment) {
        userServiceUrl = environment.getProperty("USER_SERVICE_BASE_URL", "").strip();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        if (!userServiceUrl.isBlank()) {
            // Run after the common gateway-header interceptor. Direct requests must
            // establish identity from a validated token, never a supplied user header.
            registry.addInterceptor(new UserServiceAuthenticationInterceptor(userServiceUrl))
                .order(100).addPathPatterns("/**").excludePathPatterns("/error", "/actuator/health");
        }
    }
}

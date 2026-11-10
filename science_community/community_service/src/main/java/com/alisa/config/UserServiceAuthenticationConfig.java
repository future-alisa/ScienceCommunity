package com.alisa.config;

import com.alisa.interceptors.UserServiceAuthenticationInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UserServiceAuthenticationConfig implements WebMvcConfigurer {
    private final String userServiceUrl;
    private final String writeTenantId;

    public UserServiceAuthenticationConfig(Environment environment) {
        userServiceUrl = environment.getProperty("USER_SERVICE_BASE_URL", "").strip();
        writeTenantId = environment.getProperty("SCIENCE_COMMUNITY_WRITE_TENANT_ID", "").strip();
        if (!writeTenantId.isEmpty() && userServiceUrl.isEmpty()) {
            throw new IllegalArgumentException("SCIENCE_COMMUNITY_WRITE_TENANT_ID requires USER_SERVICE_BASE_URL");
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        if (!userServiceUrl.isBlank()) {
            // Run after the common gateway-header interceptor. Direct requests must
            // establish identity from a validated token, never a supplied user header.
            registry.addInterceptor(new UserServiceAuthenticationInterceptor(userServiceUrl, writeTenantId))
                .order(100).addPathPatterns("/**").excludePathPatterns("/error", "/actuator/health");
        }
    }
}

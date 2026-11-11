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
    private final com.alisa.security.TokenVerifier oauth;

    public UserServiceAuthenticationConfig(Environment environment) {
        userServiceUrl = environment.getProperty("USER_SERVICE_BASE_URL", "").strip();
        var properties = org.springframework.boot.context.properties.bind.Binder.get(environment)
            .bind("alisa.security", com.alisa.security.ResourceSecurityProperties.class)
            .orElseGet(com.alisa.security.ResourceSecurityProperties::new);
        var server = properties.getResources().get("science-community");
        oauth = server != null && server.getIssuer() != null && !server.getIssuer().isBlank()
            ? new com.alisa.security.TokenVerifier(properties) : null;
        writeTenantId = environment.getProperty("SCIENCE_COMMUNITY_WRITE_TENANT_ID", "").strip();
        if (oauth != null && writeTenantId.isEmpty()) {
            throw new IllegalArgumentException("Alisa OAuth requires SCIENCE_COMMUNITY_WRITE_TENANT_ID");
        }
        if (!writeTenantId.isEmpty() && userServiceUrl.isEmpty()) {
            throw new IllegalArgumentException("SCIENCE_COMMUNITY_WRITE_TENANT_ID requires USER_SERVICE_BASE_URL");
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        if (!userServiceUrl.isBlank()) {
            // Run after the common gateway-header interceptor. Direct requests must
            // establish identity from a validated token, never a supplied user header.
            registry.addInterceptor(new UserServiceAuthenticationInterceptor(userServiceUrl, writeTenantId, oauth))
                .order(100).addPathPatterns("/**").excludePathPatterns("/error", "/actuator/health");
        }
    }
}

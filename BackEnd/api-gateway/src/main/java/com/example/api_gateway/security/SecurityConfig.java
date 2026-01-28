package com.example.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // 1. Disable CSRF (Must be disabled for stateless APIs)
                .csrf(csrf -> csrf.disable())

                // 2. Disable default basic/form auth
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())

                // 3. Permit all at the Security level
                // Your JwtAuthentication filter will do the actual blocking!
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll()
                );

        return http.build();
    }
}
package com.example.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder; // Changed to Reactive
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationGatewayFilterFactory
        extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private final ReactiveJwtDecoder jwtDecoder; // Changed to Reactive

    public JwtAuthenticationGatewayFilterFactory(ReactiveJwtDecoder jwtDecoder) { // Changed in constructor
        super(Config.class);
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // PUBLIC APIs
            if (path.contains("/login") || path.contains("/register")) {
                return chain.filter(exchange);
            }

            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return unauthorized(exchange);
            }

            String token = authHeader.substring(7);

            // CHANGED: Use non-blocking decode() and flatMap()
            return jwtDecoder.decode(token)
                    .flatMap(jwt -> {
                        String userId = jwt.getSubject(); // Keycloak UUID

                        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
                        if (realmAccess == null || !realmAccess.containsKey("roles")) {
                            return forbidden(exchange);
                        }

                        @SuppressWarnings("unchecked")
                        List<String> roles = (List<String>) realmAccess.get("roles");

                        // RBAC CHECK
                        if (!isAuthorized(roles, path)) {
                            return forbidden(exchange);
                        }

                        // FORWARD INFO TO MICROSERVICES
                        ServerWebExchange mutatedExchange = exchange.mutate()
                                .request(exchange.getRequest().mutate()
                                        .header("X-User-Id", userId)
                                        .header("X-User-Roles", String.join(",", roles))
                                        .build())
                                .build();

                        return chain.filter(mutatedExchange);
                    })
                    .onErrorResume(e -> unauthorized(exchange)); // Handle invalid tokens
        };
    }

    // RBAC logic remains the same...
    private boolean isAuthorized(List<String> roles, String path) {
        if (roles.contains("ADMIN")) return true;
        if (roles.contains("USER")) {
            return path.startsWith("/api/pickups") || path.startsWith("/api/tracking");
        }
        if (roles.contains("COLLECTOR")) {
            return path.startsWith("/api/pickups/assigned") || path.startsWith("/api/tracking");
        }
        return false;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> forbidden(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    public static class Config {}
}
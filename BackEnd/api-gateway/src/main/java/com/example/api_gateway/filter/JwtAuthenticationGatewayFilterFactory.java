package com.example.api_gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationGatewayFilterFactory
        extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public JwtAuthenticationGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {

        return (exchange, chain) -> {

            String path = exchange.getRequest().getURI().getPath();

            //  PUBLIC APIs (no JWT required)
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

            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtSecret.getBytes())
                        .parseClaimsJws(token)
                        .getBody();

                // SAFE EXTRACTION WITH NULL CHECKS
                Object roleObj = claims.get("roleName");
                Object userObj = claims.get("userId");

                if (roleObj == null || userObj == null) {
                    return unauthorized(exchange);
                }

                String role = roleObj.toString();
                String userId = userObj.toString();

                //  RBAC CHECK
                if (!isAuthorized(role, path)) {
                    return forbidden(exchange);
                }

                //  Forward headers to downstream services
                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(exchange.getRequest().mutate()
                                .header("X-User-Id", userId)
                                .header("X-User-Role", role)
                                .build())
                        .build();

                return chain.filter(mutatedExchange);

            } catch (Exception e) {
                return unauthorized(exchange);
            }
        };
    }

    // ================= RBAC LOGIC =================

    private boolean isAuthorized(String role, String path) {

        // ADMIN → full access
        if ("ADMIN".equalsIgnoreCase(role)) {
            return true;
        }

        // USER permissions
        if ("USER".equalsIgnoreCase(role)) {
            return path.startsWith("/api/pickups")
                    || path.startsWith("/api/tracking");
        }

        // COLLECTOR permissions
        if ("COLLECTOR".equalsIgnoreCase(role)) {
            return path.startsWith("/api/pickups/assigned")
                    || path.startsWith("/api/tracking");
        }

        // RECYCLER permissions
        if ("RECYCLER".equalsIgnoreCase(role)) {
            return path.startsWith("/api/pickups/recycle")
                    || path.startsWith("/api/tracking");
        }

        return false;
    }

    // ================= RESPONSE HELPERS =================

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> forbidden(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
    }
}
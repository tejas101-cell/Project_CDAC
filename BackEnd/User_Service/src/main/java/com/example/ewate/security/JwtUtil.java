package com.example.ewate.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(Integer userId, String email, String roleName) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                // Added explicit claims that the Gateway expects
                .claim("userId", userId)
                .claim("email", email)
                .claim("roleName", roleName.toUpperCase()) // Key matches Gateway and removed "ROLE_" prefix
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(
                        Keys.hmacShaKeyFor(secret.getBytes()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }
}
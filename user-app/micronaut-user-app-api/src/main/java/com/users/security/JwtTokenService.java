package com.users.security;

import io.micronaut.security.token.generator.TokenGenerator;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Singleton
@RequiredArgsConstructor
public class JwtTokenService {

    private final TokenGenerator tokenGenerator;

    public String generateAccessToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username);
        return tokenGenerator.generateToken(claims)
                .orElseThrow(() -> new RuntimeException("Failed to generate JWT token"));
    }

}
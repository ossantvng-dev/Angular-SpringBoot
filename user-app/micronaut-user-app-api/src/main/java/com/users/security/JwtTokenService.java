package com.users.security;

import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.generator.AccessTokenConfiguration;
import io.micronaut.security.token.generator.TokenGenerator;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

/*
    Generates access tokens from a Micronaut Authentication.

    Generating from the Authentication (rather than a hand-built claims map) lets
    Micronaut's ClaimsGenerator populate 'sub', 'roles', 'iat' and 'exp' for us.
    The 'roles' claim is part of the public contract: the Angular app decodes the
    token client-side and reads it in AuthService.getRoles() / isAdmin().
 */
@Singleton
@RequiredArgsConstructor
public class JwtTokenService {

    private final TokenGenerator tokenGenerator;
    private final AccessTokenConfiguration accessTokenConfiguration;

    public String generateAccessToken(Authentication authentication) {
        return tokenGenerator
                .generateToken(authentication, accessTokenConfiguration.getExpiration())
                .orElseThrow(() -> new IllegalStateException("Failed to generate JWT access token"));
    }
}

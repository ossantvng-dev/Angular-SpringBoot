package com.users.service.impl;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.dto.RefreshTokenRequestDTO;
import com.users.security.JwtTokenService;
import com.users.security.RefreshTokenService;
import com.users.security.UserCredentialsAuthenticator;
import com.users.service.AuthService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.security.authentication.Authentication;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserCredentialsAuthenticator credentialsAuthenticator;
    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        // Throws InvalidCredentialsException on failure, which GlobalExceptionHandler
        // renders as 401 + ApiError - the same shape Spring produced for BadCredentialsException.
        Authentication authentication = credentialsAuthenticator.authenticate(
                request.getUsername(),
                request.getPassword()
        );

        String accessToken = jwtTokenService.generateAccessToken(authentication);
        String refreshToken = refreshTokenService.create(authentication.getName());

        return new AuthResponseDTO(accessToken, refreshToken);
    }

    @Override
    public AuthResponseDTO refresh(RefreshTokenRequestDTO request) {

        String username = refreshTokenService.validate(request.getRefreshToken());

        Authentication authentication = credentialsAuthenticator.authenticationFor(username);

        String newAccessToken = jwtTokenService.generateAccessToken(authentication);
        String newRefreshToken = refreshTokenService.create(username);

        // Same sequence as the Spring version. create() has already dropped the previous
        // token via the RT_USER: index, so this is belt-and-braces rather than essential.
        refreshTokenService.revoke(request.getRefreshToken());

        return new AuthResponseDTO(newAccessToken, newRefreshToken);
    }

    @Override
    public void logout(@Nullable Authentication authentication) {

        // Null when the caller sends no token, or one that is expired or invalid.
        // Nothing to revoke in that case - logout stays idempotent and returns 204.
        if (authentication != null) {
            refreshTokenService.revokeByUsername(authentication.getName());
        }
    }
}

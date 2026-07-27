package com.users.security;

import com.users.exception.InvalidCredentialsException;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.authentication.AuthenticationFailureReason;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import io.micronaut.security.authentication.provider.HttpRequestAuthenticationProvider;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;

/*
    Micronaut Security SPI entry point.

    Implements the blocking (non-reactive) variant, which is the correct choice here
    because credential verification hits MySQL through Hibernate.
 */
@Singleton
@RequiredArgsConstructor
public class UserAuthenticationProvider<B> implements HttpRequestAuthenticationProvider<B> {

    private final UserCredentialsAuthenticator credentialsAuthenticator;

    @NonNull
    @Override
    public AuthenticationResponse authenticate(
            @Nullable HttpRequest<B> requestContext,
            AuthenticationRequest<String, String> authenticationRequest) {

        try {
            Authentication authentication = credentialsAuthenticator.authenticate(
                    authenticationRequest.getIdentity(),
                    authenticationRequest.getSecret()
            );

            return AuthenticationResponse.success(
                    authentication.getName(),
                    authentication.getRoles(),
                    authentication.getAttributes()
            );
        } catch (InvalidCredentialsException ex) {
            return AuthenticationResponse.failure(AuthenticationFailureReason.CREDENTIALS_DO_NOT_MATCH);
        }
    }
}

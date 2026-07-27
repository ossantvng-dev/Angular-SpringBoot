package com.users.security;

import com.users.entity.Role;
import com.users.entity.User;
import com.users.exception.InvalidCredentialsException;
import com.users.exception.InvalidRefreshTokenException;
import com.users.repository.UserRepository;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.authentication.ServerAuthentication;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

/*
    Single source of truth for credential verification.

    Used both by UserAuthenticationProvider (the Micronaut Security SPI entry point)
    and by AuthServiceImpl (the custom /auth/login endpoint), so the two can never
    drift apart.

    Replaces the Spring stack of DaoAuthenticationProvider + JpaUserDetailsService
    + CustomUserDetails.
 */
@Singleton
@RequiredArgsConstructor
public class UserCredentialsAuthenticator {

    public static final String ID_ATTRIBUTE = "id";

    private final UserRepository userRepository;
    private final PasswordEncoderService passwordEncoderService;

    @Transactional(readOnly = true)
    public Authentication authenticate(String username, String rawPassword) {

        // Same message for unknown user and wrong password - no user enumeration,
        // matching Spring's BadCredentialsException handling.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoderService.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return toAuthentication(user);
    }

    /*
        Used by the refresh flow, where the refresh token has already been validated
        against Redis and no password is available. Roles are re-read from the database
        rather than carried over from the old token, so a role change takes effect on
        the next refresh.
     */
    @Transactional(readOnly = true)
    public Authentication authenticationFor(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidRefreshTokenException(
                        "Invalid or expired refresh token"));

        return toAuthentication(user);
    }

    private Authentication toAuthentication(User user) {

        // Role names are already 'ROLE_USER' / 'ROLE_ADMIN' in the database, so they
        // land in the JWT 'roles' claim exactly as the Angular app expects.
        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return new ServerAuthentication(
                user.getUsername(),
                roles,
                Map.<String, Object>of(ID_ATTRIBUTE, user.getId())
        );
    }
}

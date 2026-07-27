package com.users.controller;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.dto.RefreshTokenRequestDTO;
import com.users.service.AuthService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// Mirrors Spring's .requestMatchers("/auth/**").permitAll()
@Controller("/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Post("/login")
    public HttpResponse<AuthResponseDTO> login(@Valid @Body LoginRequestDTO request) {
        return HttpResponse.ok(authService.login(request));
    }

    @Post("/refresh")
    public HttpResponse<AuthResponseDTO> refresh(@Valid @Body RefreshTokenRequestDTO request) {
        return HttpResponse.ok(authService.refresh(request));
    }

    /*
        The route is anonymous (as in Spring), but Micronaut still resolves the bearer
        token when one is present, so a valid token yields an Authentication here and an
        absent/expired one yields null. Either way the response is 204.
     */
    @Post("/logout")
    public HttpResponse<?> logout(@Nullable Authentication authentication) {
        authService.logout(authentication);
        return HttpResponse.noContent();
    }
}

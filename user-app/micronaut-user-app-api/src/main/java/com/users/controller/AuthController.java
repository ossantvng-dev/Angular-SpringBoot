package com.users.controller;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.service.AuthService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Post("/login")
    public HttpResponse<AuthResponseDTO> login(@Valid @Body LoginRequestDTO request) {
        return HttpResponse.ok(authService.login(request));
    }

}
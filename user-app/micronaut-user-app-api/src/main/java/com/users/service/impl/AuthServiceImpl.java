package com.users.service.impl;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.entity.User;
import com.users.exception.InvalidCredentialsException;
import com.users.repository.UserRepository;
import com.users.security.JwtTokenService;
import com.users.security.PasswordEncoderService;
import com.users.service.AuthService;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoderService passwordEncoderService;
    private final JwtTokenService jwtTokenService;

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        boolean matches = passwordEncoderService
                .matches(request.getPassword(), user.getPassword());

        if (!matches) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return new AuthResponseDTO(jwtTokenService.generateAccessToken(user.getUsername()), "TEMP_REFRESH_TOKEN");
    }
}

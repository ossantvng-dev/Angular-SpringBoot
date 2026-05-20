package com.users.service;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.dto.RefreshTokenRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserDetailsService userDetailsService;

    public AuthResponseDTO login(LoginRequestDTO request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtService.generateToken(Objects.requireNonNull(userDetails));
        String refreshToken = refreshTokenService.create(userDetails.getUsername());
        return new AuthResponseDTO(accessToken, refreshToken);
    }

    public AuthResponseDTO refresh(RefreshTokenRequestDTO request) {
        String username = refreshTokenService.validate(request.getRefreshToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtService.generateToken(userDetails);
        String newRefreshToken = refreshTokenService.create(username);
        refreshTokenService.revoke(request.getRefreshToken());
        return new AuthResponseDTO(newAccessToken, newRefreshToken);
    }

    public void logout(String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        refreshTokenService.revokeByUsername(username);
    }

}
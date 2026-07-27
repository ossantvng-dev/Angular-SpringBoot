package com.users.service;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;
import com.users.dto.RefreshTokenRequestDTO;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.security.authentication.Authentication;

public interface AuthService {

    AuthResponseDTO login(LoginRequestDTO request);

    AuthResponseDTO refresh(RefreshTokenRequestDTO request);

    /*
        Takes the resolved Authentication rather than the raw Authorization header.

        Micronaut has already parsed and signature-verified the bearer token by the time
        the controller runs, so re-parsing it by hand (as the Spring version did) would
        only risk trusting an unverified 'sub' claim - which would let anyone revoke
        anyone else's session.
     */
    void logout(@Nullable Authentication authentication);
}

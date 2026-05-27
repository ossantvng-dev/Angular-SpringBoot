package com.users.service;

import com.users.dto.AuthResponseDTO;
import com.users.dto.LoginRequestDTO;

public interface AuthService {

    AuthResponseDTO login(LoginRequestDTO request);

}

package com.users.service;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Override
    public UserResponseDTO create(CreateUserRequestDTO dto) {
        return null;
    }

    @Override
    public UserResponseDTO update(Long id, UpdateUserRequestDTO dto) {
        return null;
    }

    @Override
    public Page<UserResponseDTO> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public UserResponseDTO findById(Long id) {
        return null;
    }

    @Override
    public void deleteById(Long id) {

    }
}

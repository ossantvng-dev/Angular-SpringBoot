package com.users.service;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.PagedResponseDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import io.micronaut.data.model.Pageable;

public interface UserService {

    UserResponseDTO create(CreateUserRequestDTO dto);

    UserResponseDTO update(Long id, UpdateUserRequestDTO dto);

    PagedResponseDTO<UserResponseDTO> findAll(Pageable pageable);

    UserResponseDTO findById(Long id);

    void deleteById(Long id);

}
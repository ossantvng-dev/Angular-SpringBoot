package com.users.service;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponseDTO create(CreateUserRequestDTO dto);

    UserResponseDTO update(Long id, UpdateUserRequestDTO dto);

    Page<UserResponseDTO> findAll(Pageable pageable);

    UserResponseDTO findById(Long id);

    void deleteById(Long id);
}

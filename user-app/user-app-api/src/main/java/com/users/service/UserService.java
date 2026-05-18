package com.users.service;

import com.users.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserDTO create(UserDTO userDTO);

    UserDTO update(Long id, UserDTO userDTO);

    Page<UserDTO> findAll(Pageable pageable);

    UserDTO findById(Long id);

    void deleteById(Long id);
}

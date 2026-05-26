package com.users.service;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import com.users.entity.Role;
import com.users.entity.User;
import com.users.exception.ResourceNotFoundException;
import com.users.mapper.UserMapper;
import com.users.repository.RoleRepository;
import com.users.repository.UserRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;

@Singleton
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponseDTO create(CreateUserRequestDTO dto) {
        dto.setPassword(BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt()));
        User user = userMapper.toEntity(dto);
        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
        user.getRoles().add(defaultRole);
        return userMapper.toResponseDTO(userRepository.saveAndFlush(user));
    }

    @Override
    @Transactional
    public UserResponseDTO update(Long id, UpdateUserRequestDTO dto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + id + " not found"));
        existingUser.setName(dto.getName());
        existingUser.setLastName(dto.getLastName());
        existingUser.setEmail(dto.getEmail());
        existingUser.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingUser.setPassword(BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt()));
        }
        return userMapper.toResponseDTO(userRepository.saveAndFlush(existingUser));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public Page<UserResponseDTO> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponseDTO);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public UserResponseDTO findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + id + " not found"));
    }

    @Override
    @Transactional
    public void deleteById(Long id) { userRepository.deleteById(id); }
}

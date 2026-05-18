package com.users.service;

import com.users.dto.UserDTO;
import com.users.entity.User;
import com.users.mapper.UserMapper;
import com.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserDTO create(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO update(Long id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        User user = optionalUser.get();
        user.setName(userDTO.getName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        if (userDTO.getPassword() != null) {
            user.setPassword(userDTO.getPassword());
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    @Override
    public Page<UserDTO> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}

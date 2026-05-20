package com.users.mapper;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import com.users.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User toEntity(CreateUserRequestDTO dto);

    UserResponseDTO toResponseDTO(User user);

}

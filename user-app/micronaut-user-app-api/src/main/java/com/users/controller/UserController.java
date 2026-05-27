package com.users.controller;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.service.UserService;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Post
    public HttpResponse<?> create(@Valid @Body CreateUserRequestDTO dto) {
        return HttpResponse.created(userService.create(dto));
    }

    @Put("/{id}")
    public HttpResponse<?> update(Long id, @Valid @Body UpdateUserRequestDTO dto) {
        return HttpResponse.ok(userService.update(id, dto));
    }

    @Get
    public HttpResponse<?> findAll(Pageable pageable) {
        return HttpResponse.ok(userService.findAll(pageable));
    }

    @Get("/{id}")
    public HttpResponse<?> findById(Long id) {
        return HttpResponse.ok(userService.findById(id));
    }

    @Delete("/{id}")
    public HttpResponse<?> deleteById(Long id) {
        userService.deleteById(id);
        return HttpResponse.noContent();
    }
}

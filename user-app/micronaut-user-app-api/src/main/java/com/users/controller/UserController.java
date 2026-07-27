package com.users.controller;

import com.users.dto.CreateUserRequestDTO;
import com.users.dto.PagedResponseDTO;
import com.users.dto.UpdateUserRequestDTO;
import com.users.dto.UserResponseDTO;
import com.users.service.UserService;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/*
    Authorization mirrors the Spring @PreAuthorize rules exactly:
    everything is ADMIN-only except the listing, which USER and ADMIN both reach.

    @Secured is evaluated by SecuredAnnotationRule (order -200), which runs ahead of
    the intercept-url-map backstop in application.properties (order -100), so these
    annotations are the authoritative rule for these routes.
 */
@Controller("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final String ROLE_USER = "ROLE_USER";
    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private final UserService userService;

    @Post
    @Secured(ROLE_ADMIN)
    public HttpResponse<?> create(@Valid @Body CreateUserRequestDTO dto) {
        return HttpResponse.created(userService.create(dto));
    }

    @Put("/{id}")
    @Secured(ROLE_ADMIN)
    public HttpResponse<?> update(Long id, @Valid @Body UpdateUserRequestDTO dto) {
        return HttpResponse.ok(userService.update(id, dto));
    }

    // Fully typed (rather than HttpResponse<?>) so Micronaut Serde resolves the
    // element type at compile time instead of inspecting the runtime object.
    @Get
    @Secured({ROLE_USER, ROLE_ADMIN})
    public HttpResponse<PagedResponseDTO<UserResponseDTO>> findAll(Pageable pageable) {
        return HttpResponse.ok(userService.findAll(pageable));
    }

    @Get("/{id}")
    @Secured(ROLE_ADMIN)
    public HttpResponse<?> findById(Long id) {
        return HttpResponse.ok(userService.findById(id));
    }

    @Delete("/{id}")
    @Secured(ROLE_ADMIN)
    public HttpResponse<?> deleteById(Long id) {
        userService.deleteById(id);
        return HttpResponse.noContent();
    }
}

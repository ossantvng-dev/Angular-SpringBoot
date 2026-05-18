package com.users.controller;

import com.users.dto.UserDTO;
import com.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.create(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.update(id, userDTO), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<?> findAll(Pageable pageable) {
        return new ResponseEntity<>(userService.findAll(pageable), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

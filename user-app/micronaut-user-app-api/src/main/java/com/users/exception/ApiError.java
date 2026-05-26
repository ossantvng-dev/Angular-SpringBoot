package com.users.exception;

import io.micronaut.http.HttpStatus;
import io.micronaut.serde.annotation.Serdeable;

import java.time.LocalDateTime;

@Serdeable
public record ApiError(
        int status,
        String error,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ApiError of(
            HttpStatus status,
            String message,
            String path
    ) {
        return new ApiError(
                status.getCode(),
                status.getReason(),
                message,
                path,
                LocalDateTime.now()
        );
    }
}
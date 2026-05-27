package com.users.exception.handler;

import com.users.exception.ApiError;
import com.users.exception.InvalidCredentialsException;
import com.users.exception.InvalidRefreshTokenException;
import com.users.exception.ResourceNotFoundException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.authentication.AuthenticationException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.util.stream.Collectors;

@Controller
public class GlobalExceptionHandler {

    @Error(global = true, exception = ResourceNotFoundException.class)
    public HttpResponse<ApiError> handleResourceNotFound(
            HttpRequest<?> request,
            ResourceNotFoundException ex) {
        ApiError error = ApiError.of(HttpStatus.NOT_FOUND, ex.getMessage(), request.getPath());
        return HttpResponse.notFound(error);
    }

    @Error(global = true, exception = InvalidRefreshTokenException.class)
    public HttpResponse<ApiError> handleInvalidRefreshToken(
            HttpRequest<?> request,
            InvalidRefreshTokenException ex) {
        ApiError error = ApiError.of(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getPath());
        return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @Error(global = true, exception = AuthenticationException.class)
    public HttpResponse<ApiError> handleAuthenticationException(
            HttpRequest<?> request,
            AuthenticationException ex) {
        ApiError error = ApiError.of(HttpStatus.UNAUTHORIZED, "Invalid username or password", request.getPath());
        return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @Error(global = true, exception = ConstraintViolationException.class)
    public HttpResponse<ApiError> handleValidationException(
            HttpRequest<?> request,
            ConstraintViolationException ex) {

        String message = ex.getConstraintViolations()
                .stream()
                .map(this::formatViolation)
                .collect(Collectors.joining("; "));

        ApiError error = ApiError.of(HttpStatus.BAD_REQUEST, message, request.getPath());
        return HttpResponse.badRequest(error);
    }

    @Error(global = true, exception = InvalidCredentialsException.class)
    public HttpResponse<ApiError> handleInvalidCredentials(
            HttpRequest<?> request,
            InvalidCredentialsException ex) {
        ApiError error = ApiError.of(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getPath());
        return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @Error(global = true, exception = Exception.class)
    public HttpResponse<ApiError> handleGenericException(
            HttpRequest<?> request,
            Exception ex) {
        ApiError error = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request.getPath());
        return HttpResponse.serverError(error);
    }

    private String formatViolation(ConstraintViolation<?> violation) {
        String field = violation.getPropertyPath().toString();

        if (field.contains(".")) {
            field = field.substring(field.lastIndexOf('.') + 1);
        }

        return field + ": " + violation.getMessage();
    }
}
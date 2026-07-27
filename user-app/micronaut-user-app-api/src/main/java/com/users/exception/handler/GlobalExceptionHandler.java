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
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.AuthenticationException;
import io.micronaut.security.authentication.AuthorizationException;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.util.stream.Collectors;

// Error routes must stay reachable regardless of the caller's authentication state.
@Controller
@Secured(SecurityRule.IS_ANONYMOUS)
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

    /*
        Ports JwtAuthenticationEntryPoint (401) and JwtAccessDeniedHandler (403).

        This has to be declared explicitly: the SecurityFilter raises
        AuthorizationException, and without a handler for it the Exception.class
        catch-all below swallows it and renders 500 with a null message.
        A more specific @Error wins over the catch-all.
     */
    @Error(global = true, exception = AuthorizationException.class)
    public HttpResponse<ApiError> handleAuthorizationException(
            HttpRequest<?> request,
            AuthorizationException ex) {

        HttpStatus status = ex.isForbidden()
                ? HttpStatus.FORBIDDEN
                : HttpStatus.UNAUTHORIZED;

        String message = ex.isForbidden()
                ? "Access denied - insufficient permissions"
                : "Unauthorized - authentication required";

        return HttpResponse.status(status).body(ApiError.of(status, message, request.getPath()));
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
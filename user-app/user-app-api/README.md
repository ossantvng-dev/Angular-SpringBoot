# User App API (Backend)

A Spring Boot REST API for user management with JWT authentication, refresh tokens, role-based security, and Redis-backed session control.

---

# Tech Stack

- Spring Boot 4
- Spring Security
- Spring Data JPA
- Spring Data Redis
- JWT (jjwt 0.13)
- MySQL
- Lombok
- MapStruct
- Java 25

---

# Project Overview

This backend provides a secure REST API for user management with:

- JWT-based authentication
- Refresh token system using Redis
- Role-based authorization (ROLE_USER, ROLE_ADMIN)
- Stateless security architecture
- Method-level security using @PreAuthorize

---

# Authentication Flow

## Login
- User sends username and password
- Spring Security authenticates credentials
- If valid:
    - JWT access token is generated (1 hour expiration)
    - Refresh token is generated and stored in Redis

## Access Token (JWT)
- Contains:
    - username (subject)
    - roles (claims)
- Used for securing API requests

## Refresh Token
- Stored in Redis
- Valid for 7 days
- Used to generate new access tokens
- Old refresh tokens are revoked (rotation strategy)

## Logout
- Refresh token is removed from Redis
- User session is fully invalidated

---

# JWT Security Flow

1. Client sends request with:
   Authorization: Bearer <token>

2. JwtValidationFilter intercepts request
3. Token is validated:
    - Signature verification
    - Expiration check
    - Username extraction
    - Roles extraction

4. If valid:
    - Authentication is stored in SecurityContext
    - Request proceeds to controller

5. If invalid:
    - Request is rejected with 401 Unauthorized

---

# Role-Based Security

Roles are embedded in JWT:

```json
{
  "sub": "username",
  "roles": ["ROLE_USER", "ROLE_ADMIN"]
}
```
Method security:

- @PreAuthorize("hasRole('ADMIN')")
- @PreAuthorize("hasAnyRole('USER', 'ADMIN')")

---

# Services

## AuthService
Handles:
- Login
- Token generation
- Refresh token rotation
- Logout

## JwtService
Handles:
- JWT generation
- Token validation
- Username extraction
- Role extraction

## RefreshTokenService (Redis)
Handles:
- Refresh token creation
- Token validation
- Token revocation
- Single-session enforcement

Redis structure:
- RT:<token> -> username
- RT_USER:<username> -> token

---

# REST API Endpoints


| **Endpoint**       | **Method** | **Description**                                   | **Roles required** |
|---------------------|------------|---------------------------------------------------|--------------------|
| /auth/login         | POST       | Authenticates user and returns access + refresh token. | Public |
| /auth/refresh       | POST       | Generates new token pair using refresh token.     | Public |
| /auth/logout        | POST       | Invalidates refresh token and ends session.       | Public |
| /api/users          | GET        | Lists all users.                                  | USER, ADMIN |
| /api/users/{id}     | GET        | Retrieves details of a specific user.             | ADMIN |
| /api/users          | POST       | Creates a new user.                               | ADMIN |
| /api/users/{id}     | PUT        | Updates an existing user.                         | ADMIN |
| /api/users/{id}     | DELETE     | Deletes a user.                                   | ADMIN |


---

# Security Configuration

- Stateless session (no sessions)
- CSRF disabled
- CORS enabled for Angular (http://localhost:4200)
- JWT filter applied before UsernamePasswordAuthenticationFilter
- Exception handling for:
    - Unauthorized (401)
    - Access denied (403)

---

# CORS

Allowed origin:
- http://localhost:4200

Allowed methods:
- GET, POST, PUT, DELETE, OPTIONS

---

# Setup Instructions

## Requirements
- Java 25
- MySQL
- Redis

## Run application

mvn clean install
mvn spring-boot:run

---

# Summary

This API provides a full authentication system using JWT + Redis refresh tokens with strict role-based access control and stateless security design.

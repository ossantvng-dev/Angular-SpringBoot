# UserAppUi (Frontend)

A modern Angular frontend application for user management with JWT authentication, role-based access control, and automatic token refresh.

---

## 🚀 Tech Stack

- Angular 21
- RxJS
- Bootstrap 5
- SweetAlert2
- JWT Authentication
- HTTP Interceptors
- Route Guards (Auth + Role-based)

---

## 📌 Project Overview

This project is a **frontend UI for a user management system** connected to a Spring Boot backend.

It includes:

- JWT-based authentication
- Automatic token refresh
- Role-based authorization (`ROLE_USER`, `ROLE_ADMIN`)
- Protected routes
- Dynamic UI based on user roles
- Global error handling
- Responsive UI using Bootstrap

---

## 🔐 Authentication Flow

1. User logs in with username and password
2. Backend returns:
   - Access Token (JWT)
   - Refresh Token
3. Tokens are stored in `localStorage`
4. Access token is automatically attached to every HTTP request
5. When token expires:
   - Refresh token is used automatically
   - New tokens are stored
   - Original request is retried

---

## 🧠 Role-Based Access Control

The application supports two roles:

- `ROLE_USER`
- `ROLE_ADMIN`

### Permissions:

| Feature             | USER | ADMIN |
|--------------------|------|-------|
| View users         | ✔    | ✔     |
| Create user        | ❌    | ✔     |
| Edit user          | ❌    | ✔     |
| Delete user        | ❌    | ✔     |

Roles are extracted from the JWT token claims.

---

## 🧭 Routing Structure

```ts
/login
/users
/users/create
/users/edit/:id
/unauthorized
/not-found
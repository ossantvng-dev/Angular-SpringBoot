# Spring Boot → Micronaut Migration: Design & Plan

> Status: **analysis only — no code written yet.** Awaiting confirmation before implementation.
> Date: 2026-07-26

---

## Overview

### Goal

Finish migrating `user-app/user-app-api` (Spring Boot 4.0.6, Maven) into
`user-app/micronaut-user-app-api` (Micronaut 5.x, Gradle), preserving **all** existing
functionality and the **exact REST contract**, so that the Angular frontend at
`user-app/user-app-ui-redux` continues to work with **zero changes**.

### Scope

| In scope | Out of scope |
| --- | --- |
| All REST endpoints (`/auth/*`, `/api/users/*`) | Any change to the Angular frontend |
| JWT issuance/validation, roles claim | Changing the DB schema shape |
| Redis-backed refresh tokens | Rewriting business rules |
| Method-level authorization | Adding new features |
| CORS, error payloads, pagination shape | Native-image / GraalVM tuning (optional later) |

### Conventions agreed for this migration

- Constructor injection (Lombok `@RequiredArgsConstructor`), never field injection.
- `@Singleton` instead of `@Service` / `@Component`.
- `@Controller` + Micronaut HTTP annotations instead of `@RestController`.
- Compile-time DI — anything relying on Spring's runtime reflection/proxying gets an
  explicit redesign, not an annotation swap.
- Identical endpoint paths, verbs, status codes, and request/response bodies.
- Idiomatic Micronaut, not find-and-replace.

### The contract that must not break (verified against the frontend)

Read directly from `user-app-ui-redux`:

- `auth-service.ts` → `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
  (logout sends `Authorization: Bearer <token>`), response `{ accessToken, refreshToken }`.
- `auth-service.ts` decodes the JWT client-side and reads **`sub`** and **`roles`**
  (`isAdmin()` checks for the literal string `ROLE_ADMIN`). The roles claim is therefore
  part of the public contract.
- `user-service.ts` → `GET /api/users?page=&size=`, `GET/PUT/DELETE /api/users/{id}`,
  `POST /api/users`.
- `users.effects.ts` reads `response.content`, `response.totalPages`,
  `response.totalElements`, `response.pageNumber`, `response.pageSize`.
- `pagination.html` renders `totalElements` and `totalPages`; `user-list-component.html`
  binds `currentPage`/`pageSize` from **component-local** state, so `pageNumber`/`pageSize`
  from the response are stored but never rendered. **`totalElements` and `totalPages` are
  the two fields that will visibly break if they are renamed.**
- `error.interceptor.ts` reads `err.error.message` → the `ApiError.message` field must stay.

---

## Source project analysis (`user-app-api`)

### Build & dependencies

| Item | Value |
| --- | --- |
| Build tool | **Maven** (`spring-boot-starter-parent` 4.0.6) |
| Java | 25 |
| Web | `spring-boot-starter-webmvc` (servlet, blocking) |
| Persistence | `spring-boot-starter-data-jpa` + `mysql-connector-j` |
| Security | `spring-boot-starter-security` |
| Validation | `spring-boot-starter-validation` |
| Cache/session | `spring-boot-starter-data-redis` |
| JWT | `io.jsonwebtoken:jjwt` 0.13.0 (api/impl/jackson) |
| Mapping | MapStruct 1.6.3 (`componentModel = "spring"`) + Lombok + binding 0.2.0 |
| JSON | Jackson **3** (`tools.jackson.databind.ObjectMapper`, Spring Boot 4 default) |

### Package structure — `com.users`

```
com.users
├── UserAppApiApplication            @SpringBootApplication
├── configuration/
│   └── SecurityConfiguration        @Configuration @EnableMethodSecurity
├── controller/
│   ├── AuthController               @RestController @RequestMapping("/auth")
│   └── UserController               @RestController @RequestMapping("/api/users")
├── dto/
│   ├── AuthResponseDTO              { accessToken, refreshToken }
│   ├── CreateUserRequestDTO         id, name, lastName, email, username, password (+validation)
│   ├── LoginRequestDTO              username, password
│   ├── RefreshTokenRequestDTO       refreshToken
│   ├── UpdateUserRequestDTO         same as Create, password optional
│   └── UserResponseDTO              id, name, lastName, email, username  (no password)
├── entity/
│   ├── User                         @Entity users; ManyToMany → roles via users_roles
│   └── Role                         @Entity roles; ManyToMany mappedBy roles, @JsonIgnore users
├── exception/
│   ├── ApiError                     record(status, error, message, path, timestamp)
│   ├── GlobalExceptionHandler       @RestControllerAdvice
│   ├── InvalidRefreshTokenException
│   └── ResourceNotFoundException
├── mapper/
│   └── UserMapper                   @Mapper(componentModel = "spring")
├── repository/
│   ├── UserRepository               JpaRepository; @Query LEFT JOIN FETCH roles by username
│   └── RoleRepository               JpaRepository; findByName
├── security/
│   ├── JwtValidationFilter          OncePerRequestFilter
│   ├── JwtAuthenticationEntryPoint  401 → ApiError JSON
│   └── JwtAccessDeniedHandler       403 → ApiError JSON
└── service/
    ├── UserService / UserServiceImpl   CRUD + paging, @Transactional
    ├── AuthService                     login / refresh / logout
    ├── JwtService                      jjwt: generate, extractUsername, extractRoles, isTokenValid
    ├── RefreshTokenService             Redis (StringRedisTemplate), 7-day TTL, one token per user
    ├── JpaUserDetailsService           UserDetailsService
    └── CustomUserDetails               UserDetails impl (carries id)
```

### REST surface (source of truth)

| Verb | Path | Auth | Success | Body in → out |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | public | 200 | `LoginRequestDTO` → `AuthResponseDTO` |
| POST | `/auth/refresh` | public | 200 | `RefreshTokenRequestDTO` → `AuthResponseDTO` |
| POST | `/auth/logout` | public (reads header) | 204 | `Authorization` header → empty |
| POST | `/api/users` | `ROLE_ADMIN` | 201 | `CreateUserRequestDTO` → `UserResponseDTO` |
| PUT | `/api/users/{id}` | `ROLE_ADMIN` | 200 | `UpdateUserRequestDTO` → `UserResponseDTO` |
| GET | `/api/users/{id}` | `ROLE_ADMIN` | 200 | — → `UserResponseDTO` |
| GET | `/api/users` | `ROLE_USER` or `ROLE_ADMIN` | 200 | `?page&size` → `Page<UserResponseDTO>` |
| DELETE | `/api/users/{id}` | `ROLE_ADMIN` | 204 | — → empty |

### Security model

- Stateless sessions, CSRF disabled, CORS from `app.cors.allowed-origins`.
- `/auth/**` permitted; everything else authenticated.
- `JwtValidationFilter` runs before `UsernamePasswordAuthenticationFilter`: parses the
  `Bearer` token, loads the user, validates, builds authorities from the **token's `roles`
  claim**, populates `SecurityContextHolder`. Any exception → 401 `ApiError`.
- Method security via `@PreAuthorize("hasRole('ADMIN')")` / `hasAnyRole('USER','ADMIN')`.
- Login path: `AuthenticationManager` → `DaoAuthenticationProvider` → `JpaUserDetailsService`
  + `BCryptPasswordEncoder`.
- Access token: HS256, **hardcoded** 39-char secret constant in `JwtService`,
  expiry `jwt.expiration=900000` ms (15 min). Claims: `sub`, `roles`, `iat`, `exp`.
- Refresh token: opaque UUID in Redis, 7-day TTL, keys `RT:<token>` → username and
  `RT_USER:<username>` → token; creating a new one revokes the previous (single active
  session per user).

### Configuration

- `application.properties` activates the `dev` profile.
- `dev`: local MySQL `usersdb`, `ddl-auto=none`, `schema.sql` + `data.sql` replayed on
  **every** startup (`spring.sql.init.mode=always`), Redis localhost, CORS `http://localhost:4200`.
- `prod`: everything via env vars (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `REDIS_HOST`,
  `REDIS_PORT`), CORS `*`.
- Schema: `users`, `roles`, `users_roles` (composite PK, FKs **`ON DELETE CASCADE`**).
- Seed: 10 users (1–5 `ROLE_USER`, 6–10 `ROLE_ADMIN`), all BCrypt `$2a$12$…`.

---

## Target project current state (`micronaut-user-app-api`)

### Build & dependencies

| Item | Value |
| --- | --- |
| Build tool | **Gradle** (`io.micronaut.application` 5.0.0, shadow 9.4.1) |
| Java | 25, runtime Netty |
| Persistence | `micronaut-data-hibernate-jpa` + `micronaut-jdbc-hikari` + MySQL |
| Migrations | `micronaut-flyway` + `flyway-mysql` |
| Security | `micronaut-security-jwt` |
| JSON | `micronaut-serde-jackson` (compile-time serde) |
| Validation | `micronaut-validation` |
| Mapping | MapStruct 1.6.3 (`componentModel = "jsr330"`) + Lombok |
| Redis | `micronaut-redis-lettuce` — **declared but never used** |
| Odd one out | `spring-security-crypto` 6.5.1 + `spring-jcl` (pulled in only for `BCryptPasswordEncoder`) |

### What is already migrated and correct

- ✅ **All 6 DTOs** — annotated `@Serdeable`, validation constraints preserved verbatim.
- ✅ **Entities** `User` / `Role` — JPA annotations carried over, `@EqualsAndHashCode(of = "id")`
  added (an improvement over the source).
- ✅ **Repositories** — `io.micronaut.data.annotation.@Repository` + `JpaRepository`, and
  `findByUsername` correctly uses `@Join(value = "roles", type = Join.Type.LEFT_FETCH)`
  instead of a literal JPQL copy. This is **properly idiomatic** Micronaut Data.
- ✅ **`UserMapper`** — `componentModel = "jsr330"`, correct for Micronaut DI.
- ✅ **`UserServiceImpl`** — complete CRUD, constructor injection, `@Singleton`,
  `io.micronaut.transaction.annotation.@Transactional(readOnly = …)`. Functionally equivalent.
- ✅ **`ApiError`** — `@Serdeable` record with a convenient `of(HttpStatus, message, path)`
  factory; same five fields as the source.
- ✅ **`GlobalExceptionHandler`** — rewritten as `@Controller` + `@Error(global = true)`,
  which is the correct Micronaut idiom (not a copy of `@RestControllerAdvice`).
- ✅ **Flyway migrations** `V1__init.sql` / `V2__seed_data.sql` — replaces `schema.sql`/`data.sql`.
- ✅ **`UserController`** — correct `@Controller` / `@Post` / `@Put` / `@Get` / `@Delete`,
  path variables bound by name, `HttpResponse.created(...)` → 201.

### What is missing

| # | Missing | Impact |
| --- | --- | --- |
| 1 | `POST /auth/refresh` endpoint | Frontend token refresh dead |
| 2 | `POST /auth/logout` endpoint | Frontend logout call 404s |
| 3 | `AuthService.refresh()` / `.logout()` | — |
| 4 | **`RefreshTokenService` entirely absent** | `AuthServiceImpl` returns the literal string `"TEMP_REFRESH_TOKEN"`; Redis dependency unused |
| 5 | **`roles` claim in the JWT** | `authService.isAdmin()` / `roleGuard` always false → admin UI invisible, `@Secured` unusable |
| 6 | **All method-level authorization** | No `@Secured` anywhere; `intercept-url-map` only says "authenticated", so **any logged-in user can create/update/delete users**. Security regression vs. source. |
| 7 | **CORS configuration** | Browser blocks every call from `localhost:4200` |
| 8 | Access-token expiration setting | Defaults to 1 h instead of the source's 15 min |
| 9 | Entity-level validation annotations | `@NotBlank`/`@Email`/`@Size` dropped from `User` |
| 10 | `unique = true` on `email` / `username` columns | DB still enforces it; JPA metadata now disagrees |
| 11 | Per-environment config (`dev` / `prod`) | No env-var-driven prod profile |
| 12 | `CustomUserDetails` equivalent (user `id` on the principal) | Only needed if something consumes it — currently nothing does |

### What was translated incorrectly / needs rework

| # | Issue | Detail |
| --- | --- | --- |
| A | **Pagination response shape** | `UserServiceImpl.findAll` returns `io.micronaut.data.model.Page`, which serializes `totalSize` — **not** `totalElements`. The frontend reads `totalElements`, so "Showing X – Y of Z" and the page controls break. Spring emitted `totalElements`/`totalPages` but never `pageNumber`/`pageSize`. **Neither framework's native `Page` matches the frontend interface.** |
| B | **Hand-rolled authentication** | `AuthServiceImpl` loads the user and calls `passwordEncoder.matches` directly, bypassing Micronaut Security. Consequence: no `Authentication` object, so no roles in the token and `@Secured` can't work. Needs a real `AuthenticationProvider`. |
| C | **`JwtTokenService` builds claims by hand** | Manually stuffs `sub` into a claims map and calls `TokenGenerator.generateToken(Map)`. Micronaut populates `sub`, `roles`, `iat`, `exp` automatically from an `Authentication` — the manual path loses all of that. |
| D | **`V1__init.sql` dropped `ON DELETE CASCADE`** and the named FK constraints that `schema.sql` had | Deviation from the source schema; makes `users_roles` cleanup dependent purely on Hibernate's cascade behaviour |
| E | **`@Error(global = true, exception = Exception.class)`** | Broad catch-all registered alongside `AuthenticationException`; in Micronaut this can shadow more specific framework error paths (e.g. 401 rendering). Needs ordering/verification. |
| F | **`ConstraintViolationException` handler duplicates a built-in** | Micronaut already returns 400 for constraint violations; the custom handler is needed only to reshape the body into `ApiError` — fine, but the message format differs slightly from Spring's (`"field: msg; "` with trailing separator). Cosmetic; frontend only shows `.message`. |
| G | **`spring-security-crypto` + `spring-jcl` on the classpath** | Works and keeps BCrypt hash compatibility, but drags Spring into a Micronaut app. Decision needed (see below). |
| H | **Both apps point at the same `usersdb`** | Spring replays `data.sql` on every boot (wiping/reseeding); Flyway with `baseline-on-migrate=true` against an already-populated schema will skip `V1` and then run `V2`. Running both against one database will fight. |
| I | `V2__seed_data.sql` is a *versioned* migration | Runs once, whereas Spring reseeded on every start. Probably desirable — but it is a behaviour change worth acknowledging. |
| J | Micronaut default page size is 10 (Spring's is 20) | Frontend always sends `size`, so low risk; worth pinning anyway. |

---

## Migration checklist

Ordered by dependency. Nothing here is started until you confirm.

### Phase 1 — Data layer (entities, DTOs, schema)

- [x] Restore validation annotations on `User` (`@NotBlank`, `@Email`, `@Size(min=4,max=50)`) to match the source entity
- [x] Restore `unique = true` on `User.email` and `User.username` column metadata
- [x] Fix `V1__init.sql`: re-add named FK constraints and `ON DELETE CASCADE` on `users_roles` to match `schema.sql`, and switch to `CREATE TABLE IF NOT EXISTS`
- [x] ~~Decide and configure a separate database~~ — **resolved: shared `usersdb`, apps run one at a time** (decision 3)
- [ ] Verify Flyway runs clean against an empty DB (`V1` + `V2` both applied)
- [ ] Confirm DTOs need no further change (they are already complete and `@Serdeable`)

### Phase 2 — Pagination contract

- [x] Add `PagedResponseDTO<T>` (`@Serdeable` record) with exactly `content`, `totalPages`, `totalElements`, `pageNumber`, `pageSize` — flat, per decision 2
- [x] Change `UserService.findAll` to return `PagedResponseDTO<UserResponseDTO>` instead of `io.micronaut.data.model.Page`
- [x] Map from Micronaut's `Page` (`getTotalSize()` → `totalElements`, `getPageNumber()` → `pageNumber`, `getSize()` → `pageSize`) — accessors verified against `micronaut-data-model` 5.0.1
- [x] Type `UserController.findAll` as `HttpResponse<PagedResponseDTO<UserResponseDTO>>` so Serde resolves the element type at compile time
- [x] Pin pageable config — `page`/`size` param names are already Micronaut defaults and match the frontend; only `default-page-size=20` needed setting to match Spring

### Phase 3 — Repositories

- [x] No changes needed — already idiomatic. `@Join(value = "roles", type = LEFT_FETCH)` is the correct Micronaut Data equivalent of the source's `LEFT JOIN FETCH`; roles arrive eagerly, which is what `UserCredentialsAuthenticator` relies on to build the roles claim. Runtime confirmation of the emitted SQL is part of Phase 9.

### Phase 4 — Security core (must precede services/controllers that depend on it)

- [x] Implement `UserAuthenticationProvider` (`HttpRequestAuthenticationProvider`) that loads the user, verifies BCrypt, and returns `AuthenticationResponse.success(username, roles, attributes)` — replaces `DaoAuthenticationProvider` + `JpaUserDetailsService`
- [x] Extract `UserCredentialsAuthenticator` as the single source of truth for credential verification, shared by the provider and `AuthServiceImpl`
- [x] Delete the hand-rolled credential check from `AuthServiceImpl`
- [x] Rework `JwtTokenService` to generate from an `Authentication` so `sub`, **`roles`**, `iat`, `exp` are populated by Micronaut
- [x] Verify the emitted `roles` claim name — confirmed statically: `TokenConfiguration.DEFAULT_ROLES_NAME = "roles"`, `DEFAULT_NAME_KEY = "sub"`, and DB role names are already `ROLE_USER`/`ROLE_ADMIN`. Runtime confirmation deferred to Phase 9.
- [x] Set `micronaut.security.token.generator.access-token.expiration=900` (15 min, matching `jwt.expiration=900000`)
- [x] ~~Move the JWT secret into an env var~~ — **resolved: stays hardcoded** (decision 4)
- [ ] Carry the user `id` into the `Authentication` attributes (decision 7)

### Phase 5 — Refresh tokens (Redis)

- [x] Implement `RefreshTokenService` using `StatefulRedisConnection<String,String>` from `micronaut-redis-lettuce`
- [x] Reproduce the exact key scheme: `RT:<token>` → username, `RT_USER:<username>` → token, 7-day TTL
- [x] Reproduce single-active-session semantics (creating a token revokes the previous one)
- [x] Implement `create`, `validate` (throws `InvalidRefreshTokenException`), `revoke`, `revokeByUsername`

### Phase 6 — Services

- [x] Extend `AuthService` interface with `refresh(RefreshTokenRequestDTO)` and `logout(Authentication)`
- [x] Implement `refresh` in `AuthServiceImpl`: validate → reload roles from the DB → new access token → new refresh token → revoke old
- [x] Implement `logout` — **deviation:** takes the resolved `Authentication` instead of the raw `Authorization` header. Micronaut has already signature-verified the bearer token by the time the controller runs; re-parsing it by hand would mean trusting an unverified `sub` claim, letting anyone revoke anyone else's session.
- [x] Add `UserCredentialsAuthenticator.authenticationFor(username)` for the passwordless refresh path
- [x] Re-verify `UserServiceImpl` against the source (functionally equivalent; only the `findAll` return type changed)

### Phase 7 — Controllers

**7a — authorization (done, shipped with Phase 4):**

- [x] Mark `AuthController` `@Secured(SecurityRule.IS_ANONYMOUS)`
- [x] Add `@Secured("ROLE_ADMIN")` to `UserController` create / update / findById / deleteById
- [x] Add `@Secured({"ROLE_USER", "ROLE_ADMIN"})` to `findAll`
- [x] Mark `GlobalExceptionHandler` `@Secured(SecurityRule.IS_ANONYMOUS)` so error routes stay reachable
- [x] Replace the `intercept-url-map` with a fail-closed `/**` → `isAuthenticated()` backstop

**7b — remaining endpoints (blocked on Phases 5 and 6):**

- [x] Add `POST /auth/refresh` → 200 `AuthResponseDTO`
- [x] Add `POST /auth/logout` taking `@Nullable Authentication` → 204
- [x] Verify status codes at the source level: 201 create, 200 update/get, 204 delete, 204 logout (runtime confirmation is Phase 9)

### Phase 8 — Config, CORS, error handling

- [x] Enable and configure CORS (`allowed-origins` `http://localhost:4200`, methods `GET,POST,PUT,DELETE,OPTIONS`, all headers, credentials) to match `SecurityConfiguration`
- [x] Make `@Secured` the authorization source of truth — **deviation:** the `intercept-url-map` was *replaced*, not removed. `SecurityFilter` returns ALLOWED when every rule reports UNKNOWN, so a missing annotation would make an endpoint public. A `/**` → `isAuthenticated()` catch-all now fails closed, mirroring Spring's `.anyRequest().authenticated()`.
- [x] Render `ApiError` for 401/403 via `ApiErrorAuthorizationExceptionHandler` (`@Replaces(DefaultAuthorizationExceptionHandler)`) — ports `JwtAuthenticationEntryPoint` + `JwtAccessDeniedHandler`, which Micronaut's default would otherwise answer with an empty body
- [x] Split config into `application-dev.properties` / `application-prod.properties`, with `Application.defaultEnvironments(DEVELOPMENT)` mirroring `spring.profiles.active=dev`
- [ ] Review the `@Error(exception = Exception.class)` catch-all so it does not shadow security responses — **deferred to Phase 9**, needs a running app to observe

### Phase 9 — Verification (manual only — see decision 8)

Run against MySQL 8.4 + Redis 8 in Docker, 2026-07-26. App booted clean; Flyway reported
*"Successfully validated 3 migrations"* and `Schema usersdb is up to date`.

- [x] Confirm a JWT minted by Micronaut carries usable `sub` + `roles` — verified:
      `{"sub":"sofiahern","roles":["ROLE_ADMIN"],"iss":"micronaut-user-app-api","id":6,...}`,
      `exp - iat = 900s`, matching Spring's `jwt.expiration`. The `id` attribute from
      decision 7 is present in the claims.
- [x] Confirm a `ROLE_USER` account can list but **cannot** create/update/delete —
      **the regression is fixed**: `GET /api/users` 200; `GET /{id}`, `POST`, `PUT`, `DELETE`
      all 403 with `"Access denied - insufficient permissions"`.
- [x] Pagination emits the flat five-field contract — `totalPages:4, totalElements:10,
      pageNumber:0, pageSize:3` with no `totalSize` / `pageable` / `number` leakage.
- [x] Admin CRUD — 201 create, 200 get/update, 204 delete, 404 after delete. `UserResponseDTO`
      omits `password`. Deleting a user that still had role rows succeeded (join-table cleanup OK).
- [x] Refresh rotation — new token issued, previous one 401s (single active session preserved).
- [x] Logout revokes — subsequent refresh 401s.
- [x] Redis key scheme verified directly: `RT:<uuid>` / `RT_USER:<username>`, TTL 604760s (7 days).
- [x] CORS — preflight 200 with `authorization`/`content-type` echoed; disallowed origin 403.
- [x] Error contract — 401 + `ApiError` for missing/invalid token and unknown paths;
      400 with joined field messages; 401 `"Invalid username or password"` on bad credentials.
- [x] ~~Expand `MicronautUserAppApiTest` into real controller tests~~ — **out of scope** (decision 8)
- [ ] Run the Angular app itself against the Micronaut API — **not yet done**; the UI was never
      started. Every contract it depends on has been verified by hand, but the end-to-end
      click-through remains outstanding.
- [ ] Side-by-side response diff against the Spring app — **not done**; decision 3 means the two
      share a database and are not run together.

### Bugs found and fixed during Phase 9

Both were invisible at compile time and would have broken the app in different ways.

1. **Every unauthenticated request returned 500 instead of 401.** The
   `@Error(global = true, exception = Exception.class)` catch-all in `GlobalExceptionHandler`
   swallowed `AuthorizationException` before the `ExceptionHandler` bean could run — `@Error`
   routes take precedence over `ExceptionHandler` beans. Since that exception carries no message,
   the body was `{"status":500,...,"message":null}`.
   **Fix:** explicit `@Error(AuthorizationException.class)` in `GlobalExceptionHandler`
   (a more specific `@Error` beats the catch-all), splitting 401/403 on `isForbidden()`.
   `ApiErrorAuthorizationExceptionHandler` became unreachable and was deleted.

2. **Every CORS preflight returned a bodyless 403**, caused by
   `allowed-headers[0]=*` — a literal translation of Spring's `setAllowedHeaders(List.of("*"))`.
   Micronaut allows any header by default; setting a literal `*` turns it into a one-item
   allow-list that all preflights then fail. It logs nothing even at TRACE, so it had to be
   found by bisecting the config. **Fix:** omit the property (documented in
   `application.properties` so it is not reintroduced). This would have broken the Angular app
   completely while the API still looked healthy to curl — simple requests carried correct
   `Access-Control-Allow-Origin` headers throughout; only preflight failed.

---

## Spring features without a direct Micronaut equivalent

| # | Spring feature | Why it doesn't port | Proposed approach |
| --- | --- | --- | --- |
| 1 | **`@PreAuthorize("hasRole('ADMIN')")`** | Spring evaluates a SpEL expression at runtime via AOP proxies. Micronaut has no SpEL and does compile-time DI. | Use `@Secured("ROLE_ADMIN")` / `@Secured({"ROLE_USER","ROLE_ADMIN"})`. Direct role-string matching, no expression language. Covers 100% of what this app actually uses. |
| 2 | **`SecurityFilterChain` DSL** | The whole `HttpSecurity` builder (filter ordering, `addFilterBefore`, `authorizeHttpRequests`) is servlet-specific and has no Micronaut analogue. | Micronaut Security provides the JWT filter out of the box. Replace the DSL with `@Secured` annotations plus a small amount of `micronaut.security.*` config. **`JwtValidationFilter` is deleted, not ported.** |
| 3 | **`OncePerRequestFilter` (`JwtValidationFilter`)** | Depends on the servlet API and `SecurityContextHolder` (a `ThreadLocal`). Micronaut is Netty/reactive; there is no per-thread security context. | Delete. Micronaut's built-in `JwtTokenValidator` + `SecurityFilter` do this. Where the current user is needed, inject `Authentication` as a controller parameter. |
| 4 | **`SecurityContextHolder`** | ThreadLocal-based; unsafe and unavailable in Micronaut's model. | Inject `Authentication` into controller methods, or `@Nullable Principal`. |
| 5 | **`AuthenticationManager` / `DaoAuthenticationProvider` / `UserDetailsService`** | Spring-specific interfaces and contracts. | Implement one `HttpRequestAuthenticationProvider<B>` that does the load + BCrypt check + role collection. `JpaUserDetailsService` and `CustomUserDetails` collapse into it. |
| 6 | **`AuthenticationEntryPoint` / `AccessDeniedHandler`** | Servlet callbacks writing directly to `HttpServletResponse`. | Micronaut renders 401/403 itself. To keep the `ApiError` body, register `@Error` handlers (or an `AuthorizationExceptionHandler` bean) that produce the same JSON. |
| 7 | **`@RestControllerAdvice` + `@ExceptionHandler`** | Runtime AOP advice discovery. | Already done correctly: `@Controller` + `@Error(global = true, exception = …)`. |
| 8 | **`StringRedisTemplate`** | Spring Data Redis abstraction. | Lettuce directly: inject `StatefulRedisConnection<String,String>`, use `.sync()` → `set(k, v, SetArgs.Builder.ex(ttl))`, `get`, `del`. Same key scheme, same TTL. |
| 9 | **Spring Data `Page` / `Pageable` JSON shape** | `Page` serializes `totalElements`; Micronaut's serializes `totalSize`. Neither emits the frontend's full expected shape. | Explicit `PagedResponseDTO<T>` — pins all five fields, removes framework coupling from the wire format, and is the only way to guarantee the contract. |
| 10 | **`spring.sql.init` (`schema.sql` + `data.sql` on every boot)** | No equivalent; Micronaut uses Flyway/Liquibase. | Already migrated to Flyway. Accept the change from "reseed every boot" to "apply once"; use a dedicated dev database if repeatable reseeding is wanted. |
| 11 | **`@Value` field injection** (`JwtService.expirationTime`, `SecurityConfiguration.allowedOrigins`) | Field injection via reflection; contrary to the agreed conventions. | `@Value`/`@Property` on **constructor parameters**, or a `@ConfigurationProperties` bean. |
| 12 | **Spring profiles (`spring.profiles.active=dev`)** | Different mechanism/naming. | Micronaut environments: `application-dev.properties` / `application-prod.properties`, selected via `MICRONAUT_ENVIRONMENTS` or `-Dmicronaut.environments`. |
| 13 | **MapStruct `componentModel = "spring"`** | Generates a Spring `@Component`. | Already switched to `"jsr330"`. ✔ |
| 14 | **Jackson 3 `ObjectMapper` databinding** | Micronaut Serde is compile-time and reflection-free. | Already using `micronaut-serde-jackson` + `@Serdeable`. Keep every wire-facing type annotated — a missing `@Serdeable` is a runtime failure here, not a silent fallback. |

### Reflection / runtime-magic audit (compile-time DI blockers)

Everything in the source that depends on Spring's runtime reflection, and its disposition:

- `SecurityContextHolder` ThreadLocal → **removed** (item 4)
- SpEL in `@PreAuthorize` → **removed** (item 1)
- AOP proxy-based `@Transactional` → Micronaut's compile-time `@Transactional`: **works**, already in use
- Field injection via `@Value` → **converted** to constructor/config-properties (item 11)
- Jackson runtime databinding → **compile-time serde** (item 14)
- Component scanning of `@Service`/`@Component`/`@Repository` → `@Singleton` / `@Repository` resolved at compile time: **works**, already in use
- MapStruct: already compile-time in both. **No blocker.**

---

## Open questions — RESOLVED

All decisions below were confirmed on 2026-07-26 and are binding for this migration.

1. **BCrypt implementation.** → **DECIDED: keep `spring-security-crypto` (option a).**
   Zero hash risk against the seeded `$2a$12$…` values, smallest change. Revisit only if we
   later target GraalVM native-image.

2. **Pagination response shape.** → **DECIDED: emit all five fields in a FLAT structure.**
   `PagedResponseDTO` carries `content`, `totalPages`, `totalElements`, `pageNumber`, `pageSize`
   at the top level. Explicitly **not** Spring's `PagedModel` / `VIA_DTO` nested format
   (which wraps paging metadata in a `page` object) — the frontend reads these fields flat.
   The Spring project's `PageImpl` serialization warning is informational and will **not** be
   addressed; that project is being replaced, not maintained.

3. **Database isolation.** → **DECIDED: no separate database. Both apps share `usersdb`.**
   This is a learning project; the two APIs are not intended to run simultaneously.
   Phase 9 verification is therefore sequential (stop one, start the other), and the
   Spring app's `data.sql` reseed-on-boot is accepted as-is.

4. **JWT secret.** → **DECIDED: keep hardcoded in both projects.**
   Learning project; env-var handling is a practice to adopt on real projects going forward,
   not retroactively here. The two secrets stay different — tokens are not interchangeable
   between the two backends, which is fine given decision 3.

5. **Refresh-token endpoint style.** → **DECIDED: build the custom endpoint.**
   `POST /auth/refresh` → `{ accessToken, refreshToken }`. Micronaut's built-in
   `/oauth/access_token` (snake_case, different path) is not used.

6. **`/auth/logout` authorization.** → **DECIDED: keep it anonymous**, matching Spring's
   `permitAll` on `/auth/**`. The frontend's logout effect also runs on the error path and
   must not fail.

7. **`CustomUserDetails.id`.** → **DECIDED: carry the user `id` into the `Authentication`
   attributes now**, even though nothing reads it yet.

8. **Test depth.** → **DECIDED: skip unit and controller testing entirely in this migration**
   — Micronaut, Spring, and Angular alike. Testing is a separate, dedicated initiative later.
   Phase 9 is reduced to manual verification against the Angular app.

### Execution order override

Per the same decision round: **Phases 4 and 7 run first**, ahead of Phases 1–3, to close the
authorization regression as early as possible. There must be no window in which a `ROLE_USER`
account can create, update, or delete users.

Note on sequencing: Phase 7 splits. The `@Secured` annotations (7a) are part of the security
fix and land with Phase 4. The `/auth/refresh` and `/auth/logout` endpoints (7b) depend on
Phase 5 (`RefreshTokenService`) and Phase 6 (`AuthService` methods) and land after those.

Revised order: **4 + 7a → 8 (CORS/config) → 5 → 6 → 7b → 1 → 2 → 3 → 9.**

---

## Summary of the two most important findings — both RESOLVED

1. **Authorization was a security regression.** The Micronaut app had no `@Secured`
   annotations and no `roles` claim, and its `intercept-url-map` only distinguished anonymous
   from authenticated — any logged-in user, including `ROLE_USER`, could create, update, and
   delete users. Fixed in Phases 4 and 7a and **confirmed at runtime in Phase 9**: a
   `ROLE_USER` token now gets 403 on every write and on `GET /{id}`, and 200 only on the listing.

2. **Neither framework's native `Page` matched the frontend.** Micronaut serializes `totalSize`
   where the frontend reads `totalElements`, so a naive port would have silently broken the
   pagination display. `PagedResponseDTO` pins the contract; **verified at runtime** to emit
   exactly `content`, `totalPages`, `totalElements`, `pageNumber`, `pageSize`.

## Status

Phases 1–8 are complete. Phase 9 is substantially complete — every REST contract the Angular app
depends on has been exercised by hand against real MySQL and Redis. The one outstanding item is
running the Angular UI itself against this API.

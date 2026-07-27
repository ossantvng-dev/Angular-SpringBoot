-- Mirrors the Spring app's schema.sql, including the named FK constraints and
-- ON DELETE CASCADE that the first cut of this migration dropped. Without the
-- cascade, deleting a user that still has rows in users_roles depends entirely on
-- Hibernate clearing the join table first.
--
-- IF NOT EXISTS keeps this safe against a database the Spring app already created.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_users_roles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_users_roles_role
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

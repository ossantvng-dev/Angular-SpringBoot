DELETE FROM users_roles;
DELETE FROM roles;
DELETE FROM users;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE roles AUTO_INCREMENT = 1;

-- USERS
INSERT INTO users (name, last_name, email, username, password)
VALUES ('Carlos', 'Ramírez', 'carlos.ramirez@email.com', 'cramirez',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('María', 'González', 'maria.gonzalez@email.com', 'mariagonz',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Juan', 'Pérez', 'juan.perez@email.com', 'juanperz',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Ana', 'López', 'ana.lopez@email.com', 'analopez',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Luis', 'Martínez', 'luis.martinez@email.com', 'luismart',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),

       ('Sofía', 'Hernández', 'sofia.hernandez@email.com', 'sofiahern',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Diego', 'Castro', 'diego.castro@email.com', 'diegocastro',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Valeria', 'Torres', 'valeria.torres@email.com', 'valeriatorres',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Andrés', 'Vargas', 'andres.vargas@email.com', 'andresvargas',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O'),
       ('Camila', 'Rojas', 'camila.rojas@email.com', 'camilarojas',
        '$2a$12$CECZ4W.UGP5E7Aoav/.VoeajJFH2IM7VCXQltw7bJ0y/eu8C38U7O');

-- ROLES
INSERT INTO roles (name)
VALUES ('ROLE_USER'),
       ('ROLE_ADMIN');

-- USERS_ROLES
-- Users 1-5 => ROLE_USER
INSERT INTO users_roles (user_id, role_id)
VALUES (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1);

-- Users 6-10 => ROLE_ADMIN
INSERT INTO users_roles (user_id, role_id)
VALUES (6, 2),
       (7, 2),
       (8, 2),
       (9, 2),
       (10, 2);
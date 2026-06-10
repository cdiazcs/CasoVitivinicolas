UPDATE usuario 
SET password = '$2a$10$cujsUXyTsrkruVvoaL020e042DeOq1hYnT1/4Tvqt95CFcSFo9ye6' 
WHERE usuario = 'admin';

UPDATE usuario 
SET password = '$2a$10$tVB2DjB6EF4wtZfS5snTLuevqBqIEhmwViaqGzShsNn6XgHV6UCeu' 
WHERE usuario = 'dueno';

SELECT usuario, password, rol FROM usuario;
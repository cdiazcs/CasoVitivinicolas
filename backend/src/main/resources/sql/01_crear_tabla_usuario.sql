
-- Crear la tabla usuario si no existe (por si acaso)
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Insertar los usuarios
INSERT INTO usuario (usuario, password, rol) VALUES 
('admin', 'admin123', 'admin'),
('dueno', 'dueno123', 'dueno')
ON CONFLICT (usuario) DO NOTHING;

-- Verificar que se insertaron
SELECT * FROM usuario;
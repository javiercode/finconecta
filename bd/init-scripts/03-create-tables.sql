-- Asegurarse de estar en la BD y esquema correctos
\c finconecta postgres;
SET search_path TO app_schema, public;

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Campos de auditoría
    usuario_creacion VARCHAR(50) DEFAULT 'SYSTEM',
    usuario_modificacion VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP,
    
    activo BOOLEAN DEFAULT TRUE
);

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN users.id IS 'ID único autoincremental';
COMMENT ON COLUMN users.nombre IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único para login';
COMMENT ON COLUMN users.password IS 'Contraseña encriptada';

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);

-- Trigger para auditoría
CREATE OR REPLACE FUNCTION update_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_audit
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_columns();

-- Insertar datos de prueba
INSERT INTO users (nombre, username, password) VALUES
    ('Administrador Sistema', 'admin', '$2a$10$3d/6xTPu77JluHWmLPwTqePOUSsQo4wUxczpyqBg1O0KVXQ6Qz8zm'),
    ('Usuario de Prueba', 'test', '$2a$10$3d/6xTPu77JluHWmLPwTqePOUSsQo4wUxczpyqBg1O0KVXQ6Qz8zm'),
    ('Desarrollador', 'dev', '$2a$10$3d/6xTPu77JluHWmLPwTqePOUSsQo4wUxczpyqBg1O0KVXQ6Qz8zm')
ON CONFLICT (username) DO NOTHING;

-- Dar permisos al usuario de aplicación
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA app_schema TO app_user;

-- Verificación
SELECT '=== Tabla users creada ===' as mensaje;
SELECT COUNT(*) || ' usuarios insertados' as resultado FROM users;
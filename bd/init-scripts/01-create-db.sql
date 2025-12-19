-- Este script se ejecuta automáticamente al inicializar el contenedor
-- La base de datos 'finconecta' ya se crea automáticamente por POSTGRES_DB
-- Este script es para crear bases de datos adicionales si las necesitas

-- Crear base de datos adicional si es necesario
-- CREATE DATABASE otra_base_datos;

-- Crear usuario adicional para la aplicación
CREATE USER app_user WITH PASSWORD 'app_password';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE finconecta TO postgres;
GRANT CONNECT ON DATABASE finconecta TO app_user;

SELECT '=== Base de datos finconecta creada ===' as mensaje;
SELECT current_timestamp as fecha_hora;
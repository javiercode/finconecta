# Backend Dockerfile - Mantiene perfil docker al ejecutar
FROM maven:3.9-eclipse-temurin-25-alpine AS build

WORKDIR /app

# 1. Copiar archivos de construcción
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copiar código fuente (INCLUYENDO application.properties)
COPY src ./src

# 3. Compilar (NO modificar nada aquí)
RUN mvn clean package -DskipTests

# 4. Verificar construcción
RUN echo "=== Verificando JAR generado ===" && \
    find /app/target -name "*.jar" -type f -exec ls -la {} \;

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar JAR construido
COPY --from=build /app/target/*.jar /app/app.jar

# Verificar que el JAR existe
RUN echo "=== Verificación final en runtime ===" && \
    ls -la /app/app.jar

EXPOSE 8080

# FORZAR perfil docker al ejecutar - Aquí está la clave
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=docker"]
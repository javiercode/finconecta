# backend/Dockerfile
FROM maven:3.8.6-openjdk-17-slim AS build

WORKDIR /app

# Copiar solo archivos de configuración primero (para cache)
COPY pom.xml .
COPY src src

# Construir la aplicación
RUN mvn clean package -DskipTests

# Imagen final
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/*.jar app.jar

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=dev

# Puerto de la aplicación
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
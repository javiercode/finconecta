# Dockerfile para PostgreSQL
# Ubicación: bd/Dockerfile

FROM postgres:15-alpine

# Instalar herramientas útiles para debugging
RUN apk add --no-cache \
    curl \
    bash \
    vim \
    netcat-openbsd

# Configurar locale
ENV LANG en_US.utf8
ENV LC_ALL en_US.utf8

# Crear directorio para scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copiar scripts de inicialización
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Configurar permisos
RUN chmod +x /docker-entrypoint-initdb.d/*.sh 2>/dev/null || true && \
    chmod +r /docker-entrypoint-initdb.d/*.sql 2>/dev/null || true

# Script de health check personalizado
#COPY healthcheck.sh /usr/local/bin/
#RUN chmod +x /usr/local/bin/healthcheck.sh

# Cambiar usuario
USER postgres

# Exponer puerto
EXPOSE 5432

# Comando por defecto
CMD ["postgres", "-c", "listen_addresses=*", "-c", "port=5432"]
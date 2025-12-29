# Finconecta - Application Platform

Aplicación full-stack (Spring Boot + React + PostgreSQL) con despliegue en Docker y Kubernetes.

## 📁 Estructura del Proyecto

```
finconecta/
├── backend/           # Spring Boot Java 25
├── frontend/          # React 18
├── bd/               # Scripts SQL PostgreSQL
├── kubernetes/       # Configuración K8s
└── docker-compose.yml
```

## ⚙️ Configuración Rápida

### **Variables de entorno (opcional para docker-compose)**

Crea un archivo `.env` en la raíz:

```env
# Database Configuration
POSTGRES_DB=finconecta
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Backend Configuration
BACKEND_PORT=8080
BACKEND_CONTEXT_PATH=/finconecta
JWT_SECRET=miClaveSecretaSuperSeguraParaJWT2024Finconecta1234567890
JWT_EXPIRATION=3600000

# Frontend Configuration
FRONTEND_PORT=3000
REACT_APP_API_BACKEND=http://localhost:8080/finconecta/api
REACT_APP_KEY=yzR64p2_MMHOrpSbZaoAIzaSyBqcIlr5p3rDL3o
REACT_APP_PATH=finconecta

# Network Configuration
NETWORK_NAME=finconecta-network
```

## 🚀 Despliegue Rápido

### **Opción 1: Docker Compose (Recomendado para desarrollo)**

```powershell
# 1. Navegar al directorio del proyecto
cd F:\projects\personal\java\finconecta

# 2. Construir y levantar todos los servicios
docker-compose up -d --build

# 3. Verificar que todo está corriendo
docker-compose ps

# 4. Acceder a la aplicación
#    Frontend: http://localhost:3000/finconecta
#    Backend Swagger UI: http://localhost:8080/finconecta/swagger-ui/index.html

# 5. Ver logs
docker-compose logs -f backend
```

### **Opción 2: Kubernetes (Docker Desktop)**

**Requisito:** Habilitar Kubernetes en Docker Desktop

```powershell
# 1. Construir imágenes Docker
docker build -t finconecta-backend:latest ./backend
docker build -t finconecta-frontend:latest ./frontend

# 2. Desplegar en Kubernetes
kubectl apply -f .\kubernetes\namespace.yaml
kubectl apply -f .\kubernetes\secrets.yaml
kubectl apply -f .\kubernetes\configmap.yaml
kubectl apply -f .\kubernetes\postgres\
kubectl apply -f .\kubernetes\backend\
kubectl apply -f .\kubernetes\frontend\
kubectl apply -f .\kubernetes\ingress\

# 3. Esperar que los pods estén listos (30-60 segundos)
kubectl get pods -n finconecta -w

# 4. Exponer servicios localmente
# Terminal 1 - Frontend:
kubectl port-forward -n finconecta service/frontend-service 3000:3000

# Terminal 2 - Backend:
kubectl port-forward -n finconecta service/backend-service 8080:8080

# 5. Acceder
#    Frontend: http://localhost:3000/finconecta
#    Backend Swagger UI: http://localhost:8080/finconecta/swagger-ui/index.html
```

## 📊 Comandos útiles

### **Docker Compose:**
```powershell
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f [servicio]
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Detener todo
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### **Kubernetes:**
```powershell
# Ver todo
kubectl get all -n finconecta

# Ver pods
kubectl get pods -n finconecta -o wide

# Ver logs
kubectl logs -n finconecta deployment/backend-deployment -f
kubectl logs -n finconecta deployment/frontend-deployment -f

# Acceder a un pod
kubectl exec -n finconecta -it deployment/backend-deployment -- /bin/sh

# Reiniciar un servicio
kubectl rollout restart deployment/backend-deployment -n finconecta

# Eliminar todo
kubectl delete -f .\kubernetes\
```

## 🗄️ Acceso a la aplicación

### **Credenciales por defecto:**
- **Frontend**: http://localhost:3000/finconecta
- **Backend Swagger UI**: http://localhost:8080/finconecta/swagger-ui/index.html
- **PostgreSQL**: localhost:5432 (usuario: postgres, BD: finconecta)

### **Endpoints principales:**
```
POST   /api/auth/login          # Login
GET    /api/users/all           # Listar usuarios (requiere JWT)
POST   /api/users/create        # Crear usuario
GET    /api/users/{id}          # Obtener usuario
```

## 🛠️ Desarrollo

### **Modificar el backend (Spring Boot):**
```powershell
cd backend
mvn clean package -DskipTests
docker-compose build backend
docker-compose up -d backend
```

### **Modificar el frontend (React):**
```powershell
cd frontend
# Los cambios se reflejan automáticamente con hot-reload
```

### **Acceder a la base de datos:**
```powershell
# Con Docker Compose
docker exec -it finconecta-postgres psql -U postgres -d finconecta

# Con Kubernetes
kubectl port-forward -n finconecta service/postgres-service 5432:5432
# Luego usar: psql -h localhost -U postgres -d finconecta
```

## 📈 Monitoreo

### **Ver uso de recursos:**
```powershell
# Docker
docker stats

# Kubernetes
kubectl top pods -n finconecta
kubectl describe nodes
```

### **Ver estado de salud:**
```powershell
# Backend
curl http://localhost:8080/finconecta/swagger-ui/index.html

# Frontend
curl http://localhost:3000/finconecta
```

## 🧹 Limpieza

### **Docker:**
```powershell
docker-compose down -v
docker system prune -f
```

### **Kubernetes:**
```powershell
kubectl delete -f .\kubernetes\
kubectl delete namespace finconecta
```

## 📋 Requisitos del Sistema

- **Docker Desktop**: 4.0+
- **Docker Compose**: 2.0+
- **RAM**: 8 GB mínimo (16 GB recomendado)
- **Kubernetes**: Habilitado en Docker Desktop
- **Java**: 25 (incluido en Docker)
- **Node.js**: 18+ (incluido en Docker)

## 📊 Logs

Para verificarlos:
1. Verifica que todos los puertos estén libres
2. Revisa los logs con `docker-compose logs` o `kubectl logs`
3. Asegúrate de tener habilitado Kubernetes en Docker Desktop
4. Verifica que las imágenes se construyeron correctamente

---
###  **Theorethical Questions**
## 📚 **Java Spring Framework**

**¿Qué es Inyección de Dependencias y por qué es importante?**  
La Inyección de Dependencias (DI) es un patrón donde Spring provee automáticamente las dependencias que un objeto necesita, en lugar de que el objeto las cree. **Importante** porque reduce el acoplamiento, facilita testing y promueve código modular.

**¿Cuál es la diferencia entre Spring MVC y Spring Boot?**  
**Spring MVC** es un framework para aplicaciones web basado en el patrón MVC. **Spring Boot** es una extensión de Spring que simplifica la configuración y despliegue, con servidor embebido y configuración automática.

## 📚 **Bases de Datos**

**Compara MongoDB vs PostgreSQL: modelo de datos, consultas, escalabilidad**  
**MongoDB**: Documentos JSON (NoSQL), consultas flexibles, escalabilidad horizontal.  
**PostgreSQL**: Tablas relacionales (SQL), consultas SQL robustas, escalabilidad vertical y read-replicas.

**¿Cuándo elegirías uno sobre el otro?**  
**PostgreSQL** para datos transaccionales, integridad referencial y consultas complejas.  
**MongoDB** para datos no estructurados, escalabilidad masiva y esquemas flexibles.

## **AWS**

**Compara EC2 y ECS**  
**EC2**: Máquinas virtuales tradicionales, administración manual.  
**ECS**: Servicio de orquestación de contenedores Docker, gestión simplificada.

**¿Cómo asegurarías alta disponibilidad y tolerancia a fallos?**  
- Múltiples instancias en diferentes zonas de disponibilidad
- Auto Scaling Groups
- Load Balancers
- Bases de datos Multi-AZ
- Health checks y recuperación automática

## **Microservicios & Kubernetes**

**Define microservicios y sus beneficios**  
Arquitectura donde una aplicación se divide en servicios pequeños, independientes y desplegables por separado.  
**Beneficios**: Escalabilidad independiente, despliegues rápidos, tolerancia a fallos, heterogeneidad tecnológica.

**Explica cómo Kubernetes soporta arquitecturas de microservicios**  
Kubernetes provee:
- Orquestación automática de contenedores
- Service discovery y load balancing
- Auto-escalado horizontal
- Self-healing (restarts automáticos)
- Gestión de configuraciones y secretos
- Namespaces para aislamiento lógico

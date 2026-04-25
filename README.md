<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS" />
</p>

<h1 align="center">GeoAsistencia SENA</h1>

<p align="center">
  Sistema de control de asistencia basado en geolocalización GPS para el SENA.<br/>
  El docente abre la sesión desde su ubicación — el estudiante marca asistencia solo si está físicamente presente.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-v5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeORM-v0.3-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=for-the-badge" alt="Estado" />
</p>

---

## ✨ Características principales

- **Autenticación con Supabase Auth** — JWT verificado con JWKS en cada petición
- **Control de asistencia por GPS** — el estudiante debe estar en la ubicación de la clase para registrarse
- **Gestión de usuarios con roles** — Administrador, Docente y Estudiante
- **Matrículas y grupos de clase** — asignación de estudiantes a grupos con seguimiento de asistencia
- **Sesiones de clase** — apertura y cierre de llamado a lista en tiempo real
- **Carga masiva desde Excel** — importación de usuarios, asignaturas y matrículas con validación fila por fila
- **Respuestas estandarizadas** — interceptor global que normaliza todas las respuestas de la API
- **Paginación centralizada** — genérica y reutilizable en todos los listados
- **Documentación con Swagger** — disponible en `/api/doc`

---

## 🏗️ Arquitectura

El proyecto sigue las convenciones y buenas prácticas de NestJS con una separación clara de responsabilidades:

```
src/
├── academic/               # Semestres y asignaturas
├── access-control-module/  # Roles, permisos y menú de navegación
├── auth/                   # Integración con Supabase Auth
├── class-group/            # Grupos, sesiones, días de clase, asistencias y matrículas
├── common/                 # Infraestructura compartida
│   ├── decorators/         # @GetUser, @PublicAccess, @RequiredPermissions
│   ├── dtos/               # PaginationDto, PaginatedResponseDto<T>
│   ├── enums/              # Enums globales (roles, estados, días de semana)
│   ├── filters/            # HttpExceptionFilter global
│   ├── guard/              # SupabaseAuthGuard, PermissionsGuard
│   ├── interceptors/       # ResponseInterceptor global
│   ├── interface/          # ICurrentUser, IStandardResponse
│   └── utils/              # toDto(), toPaginatedDto()
├── seed/                   # Seed de datos para desarrollo
├── supabase/               # Cliente y Admin de Supabase
└── users/                  # Usuarios, docentes y estudiantes
```

### Principios aplicados

- **Servicios devuelven entidades** — los controladores mapean a DTOs de respuesta con `toDto()` y `toPaginatedDto()`.
- **Guard global de autenticación** — `SupabaseAuthGuard` registrado con `APP_GUARD`. Los endpoints públicos se marcan con `@PublicAccess()`.
- **Errores internos vs errores de cliente** — los mensajes de sistemas externos (Supabase, TypeORM) se loguean con el `Logger` de NestJS y nunca se exponen al cliente.
- **`synchronize` desactivado en producción** — se usan migraciones de TypeORM en entornos productivos.

---

## 🚀 Cómo correr el proyecto

### Requisitos

- Node.js >= 20
- pnpm (recomendado) o npm
- PostgreSQL
- Cuenta de Supabase

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/GeoAsistencia-SENA.git
cd GeoAsistencia-SENA
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_URL=...
SUPABASE_JWKS_URL=...
SUPABASE_ISSUER=...
URL_LOCAL=...
ATTENDANCE_RADIUS_METERS=..
```

### 4. Correr en desarrollo

```bash
pnpm start:dev
```

### 5. Seed de datos (solo desarrollo)

```bash
GET http://localhost:3001/api/seed
```

> ⚠️ El endpoint de seed está protegido y **no está disponible en producción**.

---

## 🐳 Docker

```bash
# Construir imagen
docker build -t geoasistencia-sena .

# Correr contenedor
docker run -p 3001:3001 --env-file .env geoasistencia-sena
```

---

## 📖 Documentación de la API

Con el proyecto corriendo, accede al Swagger en:

```
http://localhost:3001/api/doc
```

---

## 📋 Endpoints principales

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/user` | Registrar usuario |
| `GET` | `/api/user/me` | Perfil del usuario autenticado |
| `GET` | `/api/user` | Listar usuarios paginados |
| `PATCH` | `/api/user/:id` | Actualizar datos |
| `PATCH` | `/api/user/:id/roles` | Actualizar roles |
| `POST` | `/api/user/bulk/import` | Carga masiva desde Excel |

### Grupos de clase
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/class-groups` | Crear grupo |
| `GET` | `/api/class-groups` | Listar grupos (filtrado por rol) |
| `GET` | `/api/class-groups/:id` | Detalle de un grupo |
| `PATCH` | `/api/class-groups/:id` | Actualizar grupo |

### Sesiones y asistencia
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/class-sessions` | Abrir sesión / iniciar llamado a lista |
| `PATCH` | `/api/class-sessions/:id/close` | Cerrar sesión |
| `POST` | `/api/attendances/mark` | Registrar asistencia con GPS |

### Matrículas
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/enrollment/:groupId` | Estudiantes con % de asistencia |
| `POST` | `/api/enrollment/move` | Mover estudiantes entre grupos |
| `POST` | `/api/enrollment/bulk/import/:groupId` | Matriculación masiva desde Excel |

---

## 📄 Licencia

Este proyecto es de uso privado y fue desarrollado como proyecto académico para el SENA.
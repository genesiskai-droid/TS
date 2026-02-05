# TS360 Technical Service

Sistema de gestión de servicios técnicos desarrollado con NestJS y TypeScript. Plataforma completa para administración de reservas, técnicos, pagos, emergencias (SOS) y flujos de trabajo automatizados.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Documentación de APIs](#-documentación-de-apis)
- [Base de Datos](#-base-de-datos)
- [Workflows](#-workflows)
- [Seguridad](#-seguridad)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🚀 Características Principales

| Módulo | Descripción |
|--------|-------------|
| **Gestión de Reservas** | Creación, asignación y seguimiento de solicitudes de servicio |
| **Sistema de Técnicos** | Administración de personal técnico con carga de trabajo balanceada |
| **Pagos** | Integración preparada para Stripe y MercadoPago |
| **Emergencias SOS** | Sistema de alertas con prioridades configurables |
| **Workflows** | Máquina de estados finitos para gestión de procesos |
| **Auditoría** | Logging completo de todas las acciones del sistema |
| **IA** | Integración con Google Gemini para asistencia técnica |
| **Throttling** | Protección contra abuso de API |

---

## 🛠 Tecnologías

- **Framework Backend**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL (vía Prisma ORM)
- **Autenticación**: JWT con Passport
- **IA**: Google Gemini API
- **Frontend**: React (en desarrollo)

---

## 📁 Estructura del Proyecto

```
TS360/
├── backend/                 # Backend NestJS
│   ├── src/
│   │   ├── main.ts         # Punto de entrada
│   │   ├── app.module.ts   # Módulo principal
│   │   ├── config/         # Configuraciones
│   │   ├── common/         # Componentes compartidos
│   │   │   ├── decorators/ # Decoradores personalizados
│   │   │   ├── filters/    # Filtros globales
│   │   │   ├── guards/     # Guards de protección
│   │   │   ├── interceptors/ # Interceptores
│   │   │   ├── pipes/      # Pipes de validación
│   │   │   └── utils/      # Utilidades
│   │   ├── modules/        # Módulos de negocio
│   │   │   ├── auth/       # Autenticación
│   │   │   ├── users/      # Usuarios
│   │   │   ├── bookings/   # Reservas
│   │   │   ├── payments/   # Pagos
│   │   │   ├── workflows/   # Flujos de trabajo
│   │   │   ├── sos/        # Emergencias
│   │   │   ├── notifications/ # Notificaciones
│   │   │   ├── ai/         # Inteligencia Artificial
│   │   │   ├── audit/      # Auditoría
│   │   │   ├── throttler/  # Rate limiting
│   │   │   └── health/     # Health checks
│   │   ├── prisma/        # Capa de datos
│   │   └── types/         # Tipos compartidos
│   └── package.json
├── frontend/               # Frontend React (en desarrollo)
├── docs/                  # Documentación
│   ├── architecture.md   # Arquitectura del sistema
│   ├── database-schema.md # Esquema de base de datos
│   └── workflows.md       # Documentación de workflows
└── README.md
```

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd TS360

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Generar cliente Prisma
npx prisma generate

# 4. Ejecutar migraciones
npx prisma migrate dev

# 5. Iniciar servidor de desarrollo
npm run start:dev
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar en modo desarrollo con hot-reload |
| `npm run build` | Compilar el proyecto |
| `npm run start:prod` | Iniciar en producción |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npm run prisma:migrate` | Ejecutar migraciones |
| `npm run test` | Ejecutar tests |
| `npm run lint` | Verificar linting |

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```env
# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/ts360"

# JWT
JWT_SECRET="string-secreto-muy-largo-y-seguro"
JWT_REFRESH_SECRET="string-refresh-muy-largo"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"
API_PREFIX="api"

# Pagos
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# IA
GEMINI_API_KEY="AIza..."

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Auditoría
AUDIT_ENABLED=true

# Frontend
FRONTEND_URL="http://localhost:5173"
```

---

## 📚 Documentación de APIs

### Endpoints Principales

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/refresh` | Renovar token |

#### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear usuario |
| PATCH | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

#### Reservas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/bookings` | Listar reservas |
| GET | `/api/bookings/:id` | Obtener reserva por ID |
| POST | `/api/bookings` | Crear reserva |
| PATCH | `/api/bookings/:id` | Actualizar reserva |
| POST | `/api/bookings/:id/assign-technician` | Asignar técnico |
| POST | `/api/bookings/:id/cancel` | Cancelar reserva |

#### Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/payments` | Listar pagos |
| POST | `/api/payments` | Crear sesión de pago |
| POST | `/api/payments/webhook` | Webhook de Stripe |

#### Workflows
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/workflows/:id` | Obtener workflow |
| GET | `/api/workflows/booking/:bookingId` | Obtener por reserva |
| PATCH | `/api/workflows/:id/transition` | Realizar transición |

#### SOS
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sos` | Listar casos SOS |
| POST | `/api/sos/trigger` | Activar SOS |
| POST | `/api/sos/:id/resolve` | Resolver SOS |

#### IA
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generar respuesta con Gemini |

---

## 🗄 Base de Datos

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| **User** | Usuarios del sistema con roles |
| **Client** | Clientes que realizan reservas |
| **TechnicalStaff** | Personal técnico con especialidades |
| **Ticket** | Reservas/solicitudes de servicio |
| **Payment** | Pagos asociados a reservas |
| **Workflow** | Workflows asociados a reservas |
| **SOSCase** | Casos de emergencia |
| **Notification** | Notificaciones para usuarios |
| **AuditLog** | Logs de auditoría |

### Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Administrador del sistema con acceso completo |
| **MANAGER** | Gerente de operaciones |
| **CAJA** | Personal de caja para pagos |
| **TECH** | Técnico de servicio |
| **CLIENT** | Cliente del sistema |
| **SOS** | Operador de emergencias |

### Estados de Reserva

| Estado | Descripción |
|--------|-------------|
| `Registrado` | Ticket creado inicialmente |
| `Asignado` | Ticket asignado a técnico |
| `En_Taller` | Equipo en taller |
| `En_Diagnostico` | En proceso de diagnóstico |
| `En_Reparacion` | En reparación |
| `Pago` | Esperando pago |
| `Entrega` | Listo para entrega |
| `Cancelado` | Ticket cancelado |

---

## 🔄 Workflows

### Flujo Principal de Estados

```
PENDING → IN_PROGRESS → COMPLETED
             │
             ├── FAILED → PENDING (RETRY)
             │
             └── CANCELLED
```

### Transiciones Permitidas

| Estado Actual | Estado Siguiente | Evento |
|--------------|------------------|--------|
| PENDING | IN_PROGRESS | START |
| PENDING | CANCELLED | CANCEL |
| IN_PROGRESS | COMPLETED | COMPLETE |
| IN_PROGRESS | FAILED | ESCALATE |
| IN_PROGRESS | CANCELLED | CANCEL |
| FAILED | PENDING | RETRY |
| FAILED | CANCELLED | CANCEL |

---

## 🔒 Seguridad

### Autenticación JWT

- **Algoritmo**: HS256
- **Tiempo de expiración**: 15 minutos
- **Refresh token**: 7 días

### Protección de Contraseñas

- **Algoritmo**: bcrypt
- **Salt rounds**: 10

### Medidas de Seguridad

- ✅ CORS habilitado con credentials
- ✅ Validation Pipe (whitelist y forbidNonWhitelisted)
- ✅ Rate Limiting configurable
- ✅ Auditoría habilitada por defecto
- ✅ Hash de contraseñas con bcrypt

---

## 📊 Integraciones

### Google Gemini AI

- **Proveedor**: GeminiProvider
- **Modelo**: gemini-pro
- **Roles autorizados**: ADMIN, MANAGER, TECH

### Stripe (En desarrollo)

- Webhook endpoint configurado
- Requiere desarrollo adicional

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📈 Monitoreo

### Health Checks

```bash
GET /health
```

### Logs

El sistema utiliza el logger nativo de NestJS con los siguientes niveles:

- **error**: Errores críticos y excepciones
- **warn**: Advertencias
- **debug**: Información de debug
- **verbose**: Información detallada

---

## 📝 Contribución

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 📞 Soporte

Para soporte, contacta al equipo de desarrollo o abre un issue en el repositorio.

---

## 🔗 Recursos Adicionales

- [Documentación de Arquitectura](./docs/architecture.md)
- [Esquema de Base de Datos](./docs/database-schema.md)
- [Documentación de Workflows](./docs/workflows.md)
- [Contratos de API](./docs/api-contracts.md)

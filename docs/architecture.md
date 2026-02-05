# Documentación de Arquitectura - TS360 Technical Service

## 1. Visión General del Sistema

TS360 Technical Service es una plataforma de gestión de servicios técnicos desarrollada con **NestJS** (Node.js/TypeScript). El sistema proporciona un ecosistema completo para la administración de reservas, técnicos, pagos, emergencias (SOS) y flujos de trabajo automatizados.

### 1.1 Tecnología Principal

- **Framework Backend**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL (via Prisma ORM)
- **Autenticación**: JWT con Passport
- **IA**: Google Gemini API

### 1.2 Características Principales

- **Gestión de Reservas**: Creación, asignación y seguimiento de solicitudes de servicio
- **Sistema de Técnicos**: Administración de personal técnico con carga de trabajo balanceada
- **Pagos**: Integración preparada para Stripe y MercadoPago
- **Emergencias SOS**: Sistema de alertas con prioridades
- **Workflows**: Máquina de estados finitos para gestión de procesos
- **Auditoría**: Logging completo de todas las acciones del sistema
- **IA**: Integración con Google Gemini para asistencia técnica
- **Throttling**: Protección contra abuso de API

---

## 2. Arquitectura de Capas

### 2.1 Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (NestJS)                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Controladores                         ││
│  │  • AuthController      • BookingsController            ││
│  │  • UsersController      • PaymentsController            ││
│  │  • WorkflowsController  • SOSController                 ││
│  │  • NotificationsController  • AiController             ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Interceptores                        ││
│  │  • AuditInterceptor     • LoggingInterceptor           ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Guards (Protección)                 ││
│  │  • JwtAuthGuard         • RolesGuard                   ││
│  │  • PermissionsGuard    • ThrottlerGuard               ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Pipes (Validación)                  ││
│  │  • ValidationPipe                                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Capa de Servicios                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Servicios de Negocio                 ││
│  │  • AuthService       • UsersService      • BookingsService  ││
│  │  • PaymentsService   • WorkflowsService  • SOSService      ││
│  │  • NotificationsService  • AiService    • AuditService    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Capa de Acceso a Datos                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Prisma ORM                           ││
│  │  • PrismaService    • Modelos generados                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Base de Datos (PostgreSQL)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Directorios

```
backend/
├── src/
│   ├── main.ts                              # Punto de entrada de la aplicación
│   ├── app.module.ts                        # Módulo principal que importa todos los módulos
│   ├── app.controller.ts                    # Controlador raíz
│   ├── app.service.ts                       # Servicio raíz
│   │
│   ├── config/                              # Configuraciones del sistema
│   │   ├── database.config.ts              # Configuración de base de datos
│   │   ├── env.config.ts                   # Carga y validación de variables de entorno
│   │   ├── jwt.config.ts                    # Configuración JWT
│   │   ├── stripe.config.ts                 # Configuración Stripe
│   │   ├── throttle.config.ts              # Configuración de throttling
│   │   └── validation.config.ts            # Validación de entorno
│   │
│   ├── common/                              # Componentes compartidos y reutilizables
│   │   ├── constants/                      # Constantes globales
│   │   ├── decorators/                     # Decoradores personalizados
│   │   │   ├── current-user.decorator.ts   # Extrae usuario actual
│   │   │   ├── roles.decorator.ts          # Define roles permitidos
│   │   │   └── skip-audit.decorator.ts     # Omite auditoría
│   │   ├── filters/                       # Filtros globales
│   │   │   └── http-exception.filter.ts    # Manejo de excepciones HTTP
│   │   ├── guards/                         # Guards de protección
│   │   │   ├── permissions.guard.ts       # Control de permisos
│   │   │   └── roles.guard.ts             # Control de roles
│   │   ├── interceptors/                   # Interceptores
│   │   │   ├── audit.interceptor.ts       # Auditoría de requests
│   │   │   └── logging.interceptor.ts     # Logging de requests
│   │   ├── pipes/                          # Pipes de validación
│   │   │   └── validation.pipe.ts         # Validación global
│   │   └── utils/                          # Utilidades
│   │       ├── date.util.ts               # Funciones de fecha
│   │       ├── hash.util.ts               # Funciones de hash
│   │       └── token.util.ts              # Funciones de token
│   │
│   ├── modules/                            # Módulos de negocio (separados por dominio)
│   │   ├── auth/                           # Módulo de autenticación
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts             # Lógica de autenticación
│   │   │   ├── auth.controller.ts          # Endpoints de auth
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts            # DTO de login
│   │   │   │   ├── register.dto.ts         # DTO de registro
│   │   │   │   └── refresh-token.dto.ts    # DTO de refresh
│   │   │   ├── enums/
│   │   │   │   └── role.enum.ts            # Enum de roles
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts       # Guard JWT
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts      # Decorador de roles
│   │   │   └── strategies/
│   │   │       ├── jwt.strategy.ts         # Estrategia JWT
│   │   │       └── refresh.strategy.ts     # Estrategia de refresh
│   │   │
│   │   ├── users/                          # Módulo de usuarios
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts            # Lógica de usuarios
│   │   │   ├── users.controller.ts         # Endpoints de usuarios
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts      # DTO de creación
│   │   │   │   ├── update-user.dto.ts      # DTO de actualización
│   │   │   │   └── assign-role.dto.ts       # DTO de asignación de rol
│   │   │   └── index.ts
│   │   │
│   │   ├── bookings/                       # Módulo de reservas/servicios
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.service.ts        # Lógica de reservas
│   │   │   ├── bookings.controller.ts     # Endpoints de reservas
│   │   │   ├── dto/
│   │   │   │   ├── create-booking.dto.ts  # DTO de creación
│   │   │   │   ├── update-booking.dto.ts  # DTO de actualización
│   │   │   │   ├── assign-technician.dto.ts # DTO de asignación
│   │   │   │   ├── cancel-booking.dto.ts   # DTO de cancelación
│   │   │   │   └── checkin.dto.ts         # DTO de checkin
│   │   │   ├── enums/
│   │   │   │   └── booking-status.enum.ts  # Enum de estados
│   │   │   └── index.ts
│   │   │
│   │   ├── payments/                       # Módulo de pagos
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.service.ts        # Lógica de pagos
│   │   │   ├── payments.controller.ts    # Endpoints de pagos
│   │   │   ├── payments.webhook.ts       # Manejador de webhooks
│   │   │   ├── webhooks.controller.ts    # Controlador de webhooks
│   │   │   ├── dto/
│   │   │   │   ├── create-payment.dto.ts       # DTO de creación
│   │   │   │   ├── create-payment-session.dto.ts # DTO de sesión
│   │   │   │   └── webhook-payment.dto.ts      # DTO de webhook
│   │   │   ├── enums/
│   │   │   │   └── payment-status.enum.ts       # Enum de estados
│   │   │   └── index.ts
│   │   │
│   │   ├── workflows/                      # Módulo de workflows
│   │   │   ├── workflows.module.ts
│   │   │   ├── workflows.service.ts      # Lógica de workflows
│   │   │   ├── workflows.controller.ts   # Endpoints de workflows
│   │   │   ├── workflow.machine.ts       # Máquina de estados (vacío, lógica en service)
│   │   │   ├── dto/
│   │   │   │   ├── transition-workflow.dto.ts   # DTO de transición
│   │   │   │   ├── transition.dto.ts           # DTO genérico
│   │   │   │   └── workflow-context.dto.ts     # DTO de contexto
│   │   │   ├── enums/
│   │   │   │   ├── workflow-state.enum.ts       # Enum de estados
│   │   │   │   ├── workflow-event.enum.ts       # Enum de eventos
│   │   │   │   └── workflow-status.enum.ts     # Enum de estados
│   │   │   └── index.ts
│   │   │
│   │   ├── sos/                            # Módulo de emergencias SOS
│   │   │   ├── sos.module.ts
│   │   │   ├── sos.service.ts              # Lógica de SOS
│   │   │   ├── sos.controller.ts          # Endpoints de SOS
│   │   │   ├── dto/
│   │   │   │   ├── create-sos.dto.ts       # DTO de creación
│   │   │   │   ├── trigger-sos.dto.ts      # DTO de disparo
│   │   │   │   └── resolve-sos.dto.ts      # DTO de resolución
│   │   │   └── index.ts
│   │   │
│   │   ├── notifications/                  # Módulo de notificaciones
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts   # Lógica de notificaciones
│   │   │   ├── notifications.controller.ts # Endpoints de notificaciones
│   │   │   ├── dto/
│   │   │   │   └── create-notification.dto.ts # DTO de creación
│   │   │   ├── enums/
│   │   │   │   └── notification-type.enum.ts  # Enum de tipos
│   │   │   └── index.ts
│   │   │
│   │   ├── ai/                             # Módulo de IA (Gemini)
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts              # Lógica de IA
│   │   │   ├── ai.controller.ts          # Endpoints de IA
│   │   │   ├── dto/
│   │   │   │   ├── ai-context.dto.ts      # DTO de contexto
│   │   │   │   ├── ai-prompt.dto.ts       # DTO de prompt
│   │   │   │   └── ai-request.dto.ts      # DTO de request
│   │   │   ├── providers/
│   │   │   │   └── gemini.provider.ts     # Proveedor de Gemini
│   │   │   └── index.ts
│   │   │
│   │   ├── audit/                          # Módulo de auditoría
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.service.ts          # Lógica de auditoría
│   │   │   ├── decorators/
│   │   │   │   └── audit.decorator.ts    # Decorador de auditoría
│   │   │   ├── dto/
│   │   │   │   └── create-audit-log.dto.ts # DTO de log
│   │   │   └── index.ts
│   │   │
│   │   ├── throttler/                     # Módulo de rate limiting
│   │   │   ├── throttler.module.ts
│   │   │   └── throttler.guard.ts        # Guard de throttling
│   │   │
│   │   └── health/                         # Endpoints de salud
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   │
│   ├── prisma/                            # Capa de acceso a datos
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts              # Servicio Prisma
│   │
│   └── types/                             # Tipos compartidos
│       ├── basic-types.ts                 # Tipos básicos
│       ├── booking-status.enum.ts        # Estados de reserva
│       ├── payment-status.enum.ts       # Estados de pago
│       ├── roles.enum.ts                # Roles
│       ├── sos-status.enum.ts           # Estados SOS
│       └── workflow-state.enum.ts       # Estados de workflow
│
├── test/                                  # Tests E2E
├── scripts/                               # Scripts de build
├── package.json
└── tsconfig.json
```

---

## 4. Modelo de Datos

### 4.1 Entidades Principales

El sistema gestiona las siguientes entidades principales:

- **User**: Usuarios del sistema con roles
- **Client**: Clientes que realizan reservas
- **TechnicalStaff**: Personal técnico con especialidades
- **Ticket**: Reservas/solicitudes de servicio
- **Payment**: Pagos asociados a reservas
- **Workflow**: Workflows asociados a reservas
- **SOSCase**: Casos de emergencia
- **Notification**: Notificaciones para usuarios
- **AuditLog**: Logs de auditoría

### 4.2 Relaciones entre Entidades

```
User ─────┬──────> Client
          │
          ├──────> TechnicalStaff
          │
          ├──────> Ticket (como cliente)
          │
          ├──────> Ticket (como técnico asignado)
          │
          ├──────> SOSCase
          │
          └──────> Notification

Ticket ───┼──────> Payment
          ├──────> Workflow
          ├──────> HistoryEntry
          ├──────> ReceivedItem
          ├──────> DeviceDetail
          ├──────> TechnicalReport
          ├──────> Billing
          ├──────> Warranty
          └──────> TicketAssignment
```

---

## 5. Sistema de Roles y Permisos

### 5.1 Roles Definidos

| Rol | Valor en BD | Descripción |
|-----|------------|------------|
| ADMIN | ADMIN | Administrador del sistema con acceso completo |
| MANAGER | MANAGER | Gerente de operaciones |
| CAJA | CAJA | Personal de caja para pagos |
| TECNICO | TECH | Técnico de servicio |
| CLIENT | CLIENT | Cliente del sistema |
| SOS | SOS | Operador de emergencias |

### 5.2 Control de Acceso por Rol

**Módulo de Usuarios:**
- Solo ADMIN puede ver, crear, actualizar y eliminar usuarios

**Módulo de Reservas:**
- ADMIN, MANAGER: Acceso completo
- TECNICO: Solo tickets asignados
- CLIENT: Solo sus propias reservas

**Módulo de SOS:**
- ADMIN, SOS: Acceso completo

**Módulo de AI:**
- ADMIN, MANAGER, TECNICO: Acceso permitido

---

## 6. Seguridad

### 6.1 Autenticación JWT

El sistema utiliza tokens JWT para autenticación:

- **Algoritmo**: HS256
- **Tiempo de expiración**: 15 minutos
- **Refresh token**: 7 días

**Estructura del token:**
```json
{
  "sub": "userId",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234568790
}
```

### 6.2 Protección de Contraseñas

- **Algoritmo**: bcrypt
- **Salt rounds**: 10

### 6.3 Configuración de Seguridad

- **CORS**: Habilitado con credentials
- **Validation Pipe**: whitelist y forbidNonWhitelisted activos
- **Rate Limiting**: Configurable por entorno
- **Auditoría**: Habilitada por defecto

---

## 7. Configuración del Entorno

### 7.1 Variables Requeridas

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

# Pagos (pendiente implementación completa)
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

## 8. Integraciones

### 8.1 Google Gemini AI

- **Proveedor**: GeminiProvider (propia implementación)
- **Modelo**: gemini-pro
- **Acceso**: Roles ADMIN, MANAGER, TECNICO
- **Logs**: Se registran todas las interacciones

### 8.2 Stripe (Pendiente)

- Proveedor de pagos configurado pero no implementado completamente
- Webhook endpoint existe pero requiere desarrollo adicional

### 8.3 MercadoPago (Pendiente)

- Proveedor configurado en enum pero no implementado

---

## 9. Patrones de Diseño Utilizados

| Patrón | Implementación |
|--------|---------------|
| Dependency Injection | NestJS core - inyección de servicios |
| Repository | Prisma ORM como capa de datos |
| Strategy | JWT Strategy, Refresh Strategy |
| State Machine | Workflows con transiciones definidas |
| Interceptor | AuditInterceptor, LoggingInterceptor |
| Guard | JwtAuthGuard, RolesGuard, ThrottlerGuard |

---

## 10. Funcionalidades Pendientes de Implementación

Según el análisis del código, las siguientes funcionalidades están definidas pero requieren implementación:

1. **Refresh Token Endpoint**: La estrategia existe pero no hay endpoint de refresh
2. **Workflow Machine**: Archivo vacío, lógica en servicio
3. **Stripe Webhook**: Endpoint básico sin implementación completa
4. **MercadoPago**: Proveedor configurado pero no usado
5. **Health Check**: Endpoint básico sin métricas
6. **Client Management**: Métodos en UsersService pero sin controller dedicado
7. **Technical Staff Management**: Métodos en UsersService pero sin controller dedicado

---

## 11. Inicio y Deployment

### 11.1 Desarrollo

```bash
# Instalación de dependencias
npm install

# Desarrollo con hot-reload
npm run start:dev

# Prisma Studio (UI de base de datos)
npm run prisma:studio
```

### 11.2 Producción

```bash
# Build del proyecto
npm run build

# Migraciones de base de datos
npm run prisma:migrate

# Inicio en producción
npm run start:prod
```

---

## 12. Logging y Monitoreo

### 12.1 Niveles de Log de NestJS

- **error**: Errores críticos y excepciones
- **warn**: Advertencias
- **log**: Información general
- **debug**: Debug de desarrollo
- **verbose**: Trazas detalladas

### 12.2 Auditoría

El sistema implementa auditoría mediante:
- **AuditInterceptor**: Intercepta todas las requests
- **AuditService**: Persiste logs en base de datos
- **Decorador @SkipAudit()**: Para excluir endpoints específicos
- **Sanitización**: Campos sensibles son redactados automáticamente

---

## 13. Notas Técnicas Importantes

1. **Archivos de DTOs con tipos any**: Muchos servicios usan casts a `any` con Prisma, lo que indica que los tipos de Prisma no están completamente definidos o el schema.prisma no fue analizado en este contexto.

2. **Workflow Machine Vacío**: El archivo `workflow.machine.ts` está vacío; la lógica de máquina de estados está implementada directamente en `workflows.service.ts`.

3. **Roles con Valores Duplicados**: Existen dos enums de roles con valores diferentes (role.enum.ts con valores uppercase y roles.enum.ts con valores lowercase), lo que podría causar confusión.

4. ** Estados de Booking Duplicados**: Existen dos enums con estados de reserva ligeramente diferentes.

5. **Integración Stripe Pendiente**: El código tiene comentarios TODO indicando que la integración con Stripe requiere implementación completa.

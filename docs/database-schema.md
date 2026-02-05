# Esquema de Base de Datos - TS360 Technical Service

## 1. Información General

### 1.1 Motor de Base de Datos

- **Motor**: PostgreSQL
- **ORM**: Prisma Client JS
- **Proveedor**: postgresql
- **URL de conexión**: Definida en variable de entorno `DATABASE_URL`

### 1.2 Estrategia de Persistencia

- **Tipo**: Base de datos relacional (RDBMS)
- **Migraciones**: Prisma Migrate
- **Ubicación**: `prisma/migrations/`
- **Generado**: El cliente Prisma se genera automáticamente desde el schema

---

## 2. Enumeraciones

### 2.1 ClientType
Tipo de cliente.

| Valor | Descripción |
|-------|------------|
| NATURAL | Persona natural |
| JURIDICA | Empresa o persona jurídica |

### 2.2 Seniority
Nivel de experiencia del técnico.

| Valor | Descripción |
|-------|------------|
| Senior | Técnico senior con experiencia |
| Semi_Senior | Técnico semi-senior |
| Novato | Técnico novato |

### 2.3 TicketType
Tipo de ticket/solicitud de servicio.

| Valor | Descripción |
|-------|------------|
| Mantenimiento | Solicitud de mantenimiento |
| Incidente | Reporte de incidente |
| Instalacion | Solicitud de instalación |
| SOS | Caso de emergencia SOS |

### 2.4 TicketStatus
Estado del ticket. **Nota:** Existen discrepancias entre enums en código.

| Valor | Descripción |
|-------|------------|
| Registrado | Ticket creado inicialmente |
| Asignado | Ticket asignado a técnico |
| En_Taller | Equipo en taller |
| En_Ruta | Técnico en camino |
| En_Diagnostico | En proceso de diagnóstico |
| Esperando_Aprobacion | Esperando aprobación del cliente |
| En_Reparacion | En reparación |
| Control_Calidad | En control de calidad |
| Reparado | Reparación completada |
| Pago | Esperando pago |
| Entrega | Listo para entrega |
| Cancelado | Ticket cancelado |

### 2.5 Priority
Prioridad del ticket.

| Valor | Descripción |
|-------|------------|
| Baja | Prioridad baja |
| Normal | Prioridad normal |
| Alta | Prioridad alta |
| Critica | Prioridad crítica |

### 2.6 Modality
Modalidad de atención.

| Valor | Descripción |
|-------|------------|
| Taller | Atención en taller |
| Domicilio | Atención a domicilio |

### 2.7 ClientResponse
Respuesta del cliente a una cotización.

| Valor | Descripción |
|-------|------------|
| approved | Aprobada |
| rejected | Rechazada |
| customer_parts | Cliente traeré sus propias partes |

### 2.8 BillingType
Tipo de documento de facturación.

| Valor | Descripción |
|-------|------------|
| boleta | Boleta de venta |
| factura | Factura electrónica |

### 2.9 PaymentMethod
Método de pago.

| Valor | Descripción |
|-------|------------|
| CREDIT_CARD | Tarjeta de crédito |
| DEBIT_CARD | Tarjeta de débito |
| PIX | Pago por PIX |
| BOLETO | Boleto bancario |
| EFECTIVO | Pago en efectivo |
| TRANSFERENCIA | Transferencia bancaria |

### 2.10 PaymentStatus
Estado del pago.

| Valor | Descripción |
|-------|------------|
| PENDING | Pendiente |
| COMPLETED | Completado |
| FAILED | Fallido |
| CANCELED | Cancelado |

### 2.11 NotificationType
Tipo de notificación.

| Valor | Descripción |
|-------|------------|
| TICKET_CREATED | Ticket creado |
| TICKET_ASSIGNED | Ticket asignado |
| TICKET_STATUS_CHANGED | Cambio de estado de ticket |
| PAYMENT_RECEIVED | Pago recibido |
| SOS_ALERT | Alerta SOS |
| SYSTEM | Notificación del sistema |

### 2.12 UserRole
Rol de usuario en el sistema.

| Valor | Descripción |
|-------|------------|
| ADMIN | Administrador |
| MANAGER | Gerente |
| CAJA | Personal de caja |
| TECH | Técnico |
| CLIENT | Cliente |

---

## 3. Tablas

### 3.1 clients
Clientes del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID del cliente (DNI o RUC) |
| type | ClientType | NOT NULL | Tipo de cliente |
| name | TEXT | NOT NULL | Nombre o razón social |
| lastName | TEXT | - | Apellido (personas naturales) |
| email | TEXT | UNIQUE, NOT NULL | Correo electrónico |
| phone | TEXT | NOT NULL | Teléfono |
| address | TEXT | NOT NULL | Dirección |
| password | TEXT | - | Contraseña (opcional) |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | @updatedAt | Fecha de actualización |

**Índices:**
- `clients_email_key`: Única en email

**Relaciones:**
- Uno a muchos con `tickets`
- Uno a muchos con `billing_details`
- Uno a muchos con `payments`

---

### 3.2 technical_staff
Personal técnico del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| dni | TEXT | UNIQUE, NOT NULL | DNI del técnico |
| name | TEXT | NOT NULL | Nombre completo |
| email | TEXT | UNIQUE, NOT NULL | Correo electrónico |
| password | TEXT | - | Contraseña (opcional) |
| phone | TEXT | NOT NULL | Teléfono |
| level | INTEGER | NOT NULL | Nivel técnico |
| seniority | Seniority | NOT NULL | Nivel de experiencia |
| specialty | TEXT | NOT NULL | Especialidad principal |
| secondarySkills | TEXT[] | - | Habilidades secundarias |
| address | TEXT | NOT NULL | Dirección |
| currentWorkload | INTEGER | DEFAULT 0 | Carga de trabajo actual |
| isVersatile | BOOLEAN | DEFAULT false | ¿Es polivalente? |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | @updatedAt | Fecha de actualización |

**Índices:**
- `technical_staff_dni_key`: Única en DNI
- `technical_staff_email_key`: Única en email

**Relaciones:**
- Uno a muchos con `tickets` (como técnico asignado)
- Uno a muchos con `ticket_assignments`

---

### 3.3 tickets
Reservas/solicitudes de servicio.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| type | TicketType | NOT NULL | Tipo de ticket |
| title | TEXT | NOT NULL | Título del ticket |
| status | TicketStatus | DEFAULT 'Registrado' | Estado actual |
| priority | Priority | DEFAULT 'Normal' | Prioridad |
| clientId | TEXT | NOT NULL, FK → clients | ID del cliente |
| date | DateTime | DEFAULT now() | Fecha de creación |
| location | TEXT | NOT NULL | Ubicación |
| observations | TEXT | - | Observaciones |
| cost | FLOAT | - | Costo real |
| estimatedCost | FLOAT | NOT NULL | Costo estimado |
| modality | Modality | NOT NULL | Modalidad de atención |
| isSOS | BOOLEAN | DEFAULT false | ¿Es un SOS? |
| sosApproved | BOOLEAN | DEFAULT false | ¿SOS aprobado? |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | @updatedAt | Fecha de actualización |
| technicalStaffId | TEXT | FK → technical_staff | ID del técnico asignado |

**Restricciones de clave foránea:**
- `tickets_clientId_fkey`: RESTRICT on DELETE, CASCADE on UPDATE
- `tickets_technicalStaffId_fkey`: SET NULL on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `clients`
- Muchos a uno con `technical_staff` (opcional)
- Uno a uno con `billing_details`
- Uno a uno con `device_details`
- Uno a uno con `technical_report`
- Uno a uno con `warranty`
- Uno a muchos con `history_entries`
- Uno a muchos con `payments`
- Uno a muchos con `received_items`
- Uno a muchos con `ticket_assignments`

---

### 3.4 history_entries
Historial de cambios de estado de tickets.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| status | TEXT | NOT NULL | Estado registrado |
| timestamp | DateTime | DEFAULT now() | Fecha del registro |
| note | TEXT | NOT NULL | Nota o comentario |
| ticketId | TEXT | NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `history_entries_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `tickets`

---

### 3.5 received_items
Items recibidos con el ticket.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| type | TEXT | NOT NULL | Tipo de item |
| brand | TEXT | NOT NULL | Marca |
| model | TEXT | NOT NULL | Modelo |
| serial | TEXT | NOT NULL | Número de serie |
| quantity | INTEGER | NOT NULL | Cantidad |
| status | TEXT | NOT NULL | Estado del item |
| notes | TEXT | - | Notas adicionales |
| ticketId | TEXT | NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `received_items_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `tickets`

---

### 3.6 device_details
Detalles del dispositivo asociado al ticket.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| category | TEXT | NOT NULL | Categoría del dispositivo |
| device | TEXT | NOT NULL | Nombre del dispositivo |
| serviceName | TEXT | NOT NULL | Nombre del servicio |
| iconName | TEXT | NOT NULL | Nombre del ícono |
| color | TEXT | NOT NULL | Color asociado |
| subServices | TEXT[] | - | Sub-servicios |
| basePrice | FLOAT | NOT NULL | Precio base |
| ticketId | TEXT | UNIQUE, NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `device_details_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Uno a uno con `tickets`

---

### 3.7 technical_reports
Informes técnicos de los tickets.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| techNotes | TEXT | NOT NULL | Notas técnicas |
| laborCost | FLOAT | - | Costo de mano de obra |
| priceAdjustment | FLOAT | - | Ajuste de precio |
| adjustmentReason | TEXT | - | Razón del ajuste |
| timestamp | DateTime | DEFAULT now() | Fecha del informe |
| clientResponse | ClientResponse | - | Respuesta del cliente |
| clientNote | TEXT | - | Nota del cliente |
| ticketId | TEXT | UNIQUE, NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `technical_reports_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Uno a uno con `tickets`
- Uno a muchos con `quote_items`

---

### 3.8 quote_items
Items de cotización dentro de un informe técnico.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| description | TEXT | NOT NULL | Descripción del item |
| price | FLOAT | NOT NULL | Precio del item |
| technicalReportId | TEXT | NOT NULL, FK → technical_reports | ID del informe técnico |

**Restricciones de clave foránea:**
- `quote_items_technicalReportId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `technical_reports`

---

### 3.9 billing_details
Detalles de facturación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| type | BillingType | NOT NULL | Tipo de documento |
| documentId | TEXT | NOT NULL | Número de documento |
| name | TEXT | NOT NULL | Nombre en factura |
| address | TEXT | NOT NULL | Dirección de facturación |
| email | TEXT | NOT NULL | Email de facturación |
| clientId | TEXT | FK → clients | ID del cliente |
| ticketId | TEXT | UNIQUE, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `billing_details_clientId_fkey`: SET NULL on DELETE, CASCADE on UPDATE
- `billing_details_ticketId_fkey`: SET NULL on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `clients` (opcional)
- Uno a uno con `tickets` (opcional)

---

### 3.10 warranties
Garantías asociadas a tickets.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| months | INTEGER | NOT NULL | Meses de garantía |
| percentage | FLOAT | NOT NULL | Porcentaje de garantía |
| cost | FLOAT | NOT NULL | Costo de garantía |
| expiryDate | DateTime | - | Fecha de expiración |
| ticketId | TEXT | UNIQUE, NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `warranties_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Uno a uno con `tickets`

---

### 3.11 payments
Registros de pagos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| amount | FLOAT | NOT NULL | Monto del pago |
| method | PaymentMethod | NOT NULL | Método de pago |
| status | PaymentStatus | DEFAULT 'PENDING' | Estado del pago |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| clientId | TEXT | FK → clients | ID del cliente |
| ticketId | TEXT | FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `payments_clientId_fkey`: SET NULL on DELETE, CASCADE on UPDATE
- `payments_ticketId_fkey`: SET NULL on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `clients` (opcional)
- Muchos a uno con `tickets` (opcional)

---

### 3.12 ticket_assignments
Asignaciones de técnicos a tickets.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| assignedAt | DateTime | DEFAULT now() | Fecha de asignación |
| technicalStaffId | TEXT | NOT NULL, FK → technical_staff | ID del técnico |
| ticketId | TEXT | NOT NULL, FK → tickets | ID del ticket |

**Restricciones de clave foránea:**
- `ticket_assignments_technicalStaffId_fkey`: RESTRICT on DELETE, CASCADE on UPDATE
- `ticket_assignments_ticketId_fkey`: CASCADE on DELETE, CASCADE on UPDATE

**Relaciones:**
- Muchos a uno con `technical_staff`
- Muchos a uno con `tickets`

---

### 3.13 audit_logs
Logs de auditoría del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| action | TEXT | NOT NULL | Acción realizada |
| entity | TEXT | NOT NULL | Entidad afectada |
| payload | JSONB | - | Datos adicionales |
| ipAddress | TEXT | - | IP del cliente |
| userAgent | TEXT | - | User agent del cliente |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |

**Nota:** No tiene relaciones con otras tablas.

---

### 3.14 notifications
Notificaciones del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| type | NotificationType | NOT NULL | Tipo de notificación |
| title | TEXT | NOT NULL | Título |
| message | TEXT | NOT NULL | Mensaje |
| data | JSONB | - | Datos adicionales |
| isRead | BOOLEAN | DEFAULT false | ¿Leída? |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |

**Nota:** No tiene relaciones con otras tablas. No hay campo userId en el schema.

---

### 3.15 ai_interactions
Interacciones con el modelo de IA.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| prompt | TEXT | NOT NULL | Prompt enviado |
| response | TEXT | NOT NULL | Respuesta generada |
| model | TEXT | NOT NULL | Modelo de IA usado |
| tokens | INTEGER | - | Cantidad de tokens |
| metadata | JSONB | - | Metadatos adicionales |
| userId | TEXT | - | ID del usuario (opcional) |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |

**Nota:** El campo userId es opcional.

---

### 3.16 users
Usuarios del sistema para autenticación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | TEXT | PRIMARY KEY | ID único (UUID) |
| email | TEXT | UNIQUE, NOT NULL | Correo electrónico |
| password | TEXT | NOT NULL | Contraseña hasheada |
| role | UserRole | DEFAULT 'CLIENT' | Rol del usuario |
| isActive | BOOLEAN | DEFAULT true | ¿Usuario activo? |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | @updatedAt | Fecha de actualización |

**Índices:**
- `users_email_key`: Única en email

**Nota:** No tiene relaciones con otras tablas en el schema actual.

---

## 4. Diagrama de Relaciones

```
┌─────────────┐       ┌──────────────────┐
│    users    │       │     clients      │
└─────────────┘       └──────────────────┘
                              │
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌──────────────────┐
│technical_staff│      │   tickets   │       │  billing_details │
└─────────────┘       └─────────────┘       └──────────────────┘
       │                      │
       │                      │
       │          ┌───────────┼───────────┐
       │          │           │           │
       │          ▼           ▼           ▼
       │    ┌──────────┐ ┌──────────┐ ┌──────────┐
       │    │history_  │ │received_ │ │  ticket  │
       │    │ entries  │ │  items   │ │assignments
       │    └──────────┘ └──────────┘ └──────────┘
       │
       │          ┌─────────────────────────┐
       └──────────│ device_details          │
                  │ technical_reports       │
                  │ warranties              │
                  │ payments                │
                  └─────────────────────────┘
```

---

## 5. Reglas de Integridad

### 5.1 Eliminación en Cascada

Las siguientes tablas eliminan sus registros relacionados automáticamente:
- `tickets` → `history_entries`, `received_items`, `device_details`, `technical_reports`, `quote_items`, `warranties`, `ticket_assignments`
- `technical_reports` → `quote_items`
- `tickets` (desde `billing_details`, `payments`) → SET NULL

### 5.2 Eliminación Restringida

- `clients` → RESTRICT (no se puede eliminar si tiene tickets)
- `technical_staff` → RESTRICT (no se puede eliminar si tiene asignaciones activas)

### 5.3 Restricciones de Unicidad

- `clients.email`: Única
- `technical_staff.dni`: Única
- `technical_staff.email`: Única
- `users.email`: Única
- `device_details.ticketId`: Única (uno a uno)
- `technical_reports.ticketId`: Única (uno a uno)
- `billing_details.ticketId`: Única (uno a uno)
- `warranties.ticketId`: Única (uno a uno)

---

## 6. Información No Especificada

Los siguientes elementos no están definidos explícitamente en el schema.prisma:

1. **Tabla de SOS**: No existe modelo SOS en el schema, pero el código referencia SOS en servicios
2. **Tabla de Workflows**: No existe modelo workflow en el schema, pero hay módulo de workflows
3. **Campo userId en notifications**: El modelo no tiene campo para relacionar con usuario
4. **Relación users con otras tablas**: La tabla users está aislada, no relacionada con tickets o clientes
5. **Tabla de refresh tokens**: No existe para manejo de sesiones

---

## 7. Notas Técnicas

### 7.1 Tipos de Datos PostgreSQL Usados

- `TEXT`: Para strings largos
- `INTEGER`: Para números enteros
- `FLOAT` / `DOUBLE PRECISION`: Para números decimales
- `BOOLEAN`: Para valores booleanos
- `DateTime`: Para timestamps
- `JSONB`: Para datos estructurados flexibles
- `TEXT[]`: Para arrays de strings

### 7.2 Valor por Defecto

- `now()`: Timestamp actual
- `uuid()`: ID único generado
- `CURRENT_TIMESTAMP`: Timestamp de PostgreSQL

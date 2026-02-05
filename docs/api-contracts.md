# Contratos de API - TS360 Technical Service

## Información General

- **Versión API**: 1.0.0
- **Prefijo Base**: `/api`
- **Formato de respuesta**: JSON
- **Autenticación**: JWT Bearer Token

---

## Módulo de Autenticación

### POST /auth/login

Autenticación de usuarios mediante email y contraseña.

**Cuerpo de la petición:**
```json
{
  "email": "string (email válido)",
  "password": "string (mínimo 6 caracteres)"
}
```

**Respuesta (200 OK):**
```json
{
  "access_token": "string (token JWT)",
  "user": {
    "id": "string",
    "email": "string",
    "role": "ADMIN | MANAGER | CAJA | TECNICO | CLIENT"
  }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas

---

### POST /auth/register

Registro de nuevos usuarios.

**Cuerpo de la petición:**
```json
{
  "email": "string (email válido)",
  "password": "string (mínimo 8 caracteres)",
  "role?": "ADMIN | MANAGER | CAJA | TECNICO | CLIENT"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "string",
  "email": "string",
  "role": "string"
}
```

---

## Módulo de Usuarios

**Nota:** Todos los endpoints requieren autenticación JWT y rol ADMIN.

### GET /users

Obtiene todos los usuarios del sistema.

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "email": "string",
    "role": "string",
    "createdAt": "DateTime"
  }
]
```

---

### GET /users/:id

Obtiene un usuario por su ID.

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "role": "string"
}
```

---

### PATCH /users/:id

Actualiza un usuario existente.

**Cuerpo de la petición:**
```json
{
  "email?": "string",
  "password?": "string",
  "role?": "string"
}
```

---

### DELETE /users/:id

Elimina un usuario del sistema.

---

## Módulo de Reservas (Bookings)

### POST /bookings

Crea una nueva reserva o solicitud de servicio.

**Cuerpo de la petición:**
```json
{
  "type?": "string",
  "title?": "string",
  "clientId": "string (UUID)",
  "location": "string",
  "observations?": "string",
  "estimatedCost?": "number",
  "priority?": "string",
  "modality?": "string",
  "isSOS?": "boolean"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "string",
  "type": "string",
  "title": "string",
  "status": "Registrado",
  "priority": "string",
  "clientId": "string",
  "location": "string",
  "observations": "string",
  "estimatedCost": "number",
  "modality": "string",
  "isSOS": "boolean",
  "date": "DateTime"
}
```

---

### GET /bookings

Obtiene todas las reservas del sistema.

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "type": "string",
    "title": "string",
    "status": "string",
    "priority": "string",
    "client": { /* objeto cliente */ },
    "technicalStaff": { /* objeto técnico */ },
    "date": "DateTime"
  }
]
```

---

### GET /bookings/:id

Obtiene una reserva específica por su ID con todos sus detalles relacionados.

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "type": "string",
  "status": "string",
  "client": { /* objeto cliente */ },
  "technicalStaff": { /* objeto técnico */ },
  "history": [ /* historial de cambios */ ],
  "receptionItems": [ /* items recibidos */ ],
  "deviceDetails": [ /* detalles del dispositivo */ ],
  "technicalReport": {
    "quoteItems": [ /* items de cotización */ ]
  },
  "billing": { /* información de facturación */ },
  "warranty": { /* información de garantía */ },
  "payments": [ /* pagos asociados */ ],
  "assignments": [ /* asignaciones */ ]
}
```

---

### PUT /bookings/:id

Actualiza una reserva existente.

**Cuerpo de la petición:**
```json
{
  "status?": "string",
  "priority?": "string",
  "observations?": "string",
  "cost?": "number",
  "modality?": "string"
}
```

---

### PUT /bookings/:id/assign-technician

Asigna un técnico a una reserva.

**Cuerpo de la petición:**
```json
{
  "technicianId": "string"
}
```

---

### PATCH /bookings/:id/status

Actualiza el estado de una reserva.

**Cuerpo de la petición:**
```json
{
  "status": "Registrado | EnRevision | Asignado | EnProceso | EsperandoRepuestos | ListoParaEntrega | Entregado | Cancelado",
  "note?": "string"
}
```

---

### DELETE /bookings/:id

Cancela una reserva.

**Cuerpo de la petición:**
```json
{
  "reason?": "string"
}
```

---

### GET /bookings/available-technicians

Obtiene la lista de técnicos disponibles ordenados por carga de trabajo actual.

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "specialty": "string",
    "currentWorkload": "number"
  }
]
```

---

### GET /bookings/client/:clientId

Obtiene todas las reservas de un cliente específico.

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "type": "string",
    "title": "string",
    "status": "string",
    "technicalStaff": { /* objeto técnico */ },
    "date": "DateTime"
  }
]
```

---

## Módulo de Pagos

### POST /payments/session

Crea una sesión de pago para una reserva.

**Cuerpo de la petición:**
```json
{
  "bookingId": "string",
  "amount": "number",
  "currency": "string (USD | EUR | PEN)"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "bookingId": "string",
  "amount": "number",
  "currency": "string",
  "provider": "STRIPE | MERCADOPAGO",
  "status": "PENDING"
}
```

**Nota:** La integración con Stripe está pendiente de implementación completa.

---

### POST /payments/webhook

Webhook para recibir notificaciones de pago de proveedores externos (Stripe/MercadoPago).

**Encabezados:**
```
Stripe-Signature: string
```

**Cuerpo de la petición:**
```json
{
  "id": "string",
  "type": "string",
  "data": {
    "object": { /* objeto de pago */ }
  }
}
```

---

## Módulo de Workflows

### GET /workflows/:id

Obtiene un workflow por su ID.

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "currentState": "PENDING | IN_PROGRESS | COMPLETED | FAILED",
  "bookingId": "string",
  "userId": "string",
  "event": "string",
  "metadata": {
    "previousState": "string",
    "actorId": "string",
    "reason": "string",
    "transitionedAt": "DateTime"
  }
}
```

---

### GET /workflows/booking/:bookingId

Obtiene el workflow asociado a una reserva específica.

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "currentState": "PENDING | IN_PROGRESS | COMPLETED | FAILED",
  "bookingId": "string"
}
```

---

### PATCH /workflows/:id/transition

Realiza una transición de estado en un workflow.

**Roles autorizados:** ADMIN, MANAGER, TECNICO

**Cuerpo de la petición:**
```json
{
  "nextStatus": "PENDING | IN_PROGRESS | COMPLETED | FAILED"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "string",
  "currentState": "string",
  "event": "string",
  "metadata": {
    "previousState": "string",
    "actorId": "string",
    "transitionedAt": "DateTime"
  }
}
```

---

## Módulo SOS

### POST /sos/trigger

Dispara una alerta SOS (cualquier usuario autenticado).

**Cuerpo de la petición:**
```json
{
  "description?": "string (máximo 500 caracteres)",
  "priority?": "LOW | MEDIUM | HIGH | CRITICAL",
  "location?": "string",
  "bookingId?": "string (UUID)",
  "metadata?": "object"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "string",
  "triggeredById": "string",
  "description": "string",
  "status": "PENDING",
  "createdAt": "DateTime"
}
```

---

### GET /sos

Lista todos los casos SOS del sistema.

**Roles autorizados:** ADMIN, SOS

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "triggeredBy": {
      "id": "string",
      "email": "string",
      "role": "string"
    },
    "description": "string",
    "status": "PENDING | ACKNOWLEDGED | RESOLVED",
    "createdAt": "DateTime"
  }
]
```

---

### PATCH /sos/:id/acknowledge

Reconoce un caso SOS pendiente.

**Roles autorizados:** ADMIN, SOS

---

### PATCH /sos/:id/resolve

Resuelve un caso SOS.

**Roles autorizados:** ADMIN, SOS

**Cuerpo de la petición:**
```json
{
  "resolutionNote?": "string"
}
```

---

## Módulo de Notificaciones

### GET /notifications

Obtiene las notificaciones del usuario autenticado.

**Respuesta (200 OK):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "type": "string",
    "title": "string",
    "message": "string",
    "data": "object",
    "isRead": "boolean",
    "createdAt": "DateTime"
  }
]
```

---

## Módulo de AI

### POST /ai/ask

Envía una consulta al modelo de IA (Google Gemini).

**Roles autorizados:** ADMIN, MANAGER, TECNICO

**Cuerpo de la petición:**
```json
{
  "prompt": "string",
  "context?": "object"
}
```

**Respuesta (200 OK):**
```json
{
  "response": "string"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token no válido o expirado |
| 403 | Forbidden - No tiene permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

---

## Encabezados de Autenticación

```
Authorization: Bearer <token JWT>
```

---

## Rate Limiting

El API implementa throttling con límites configurables:
- **TTL**: 60 segundos (por defecto)
- **Límite**: 100 requests por ventana (por defecto)

---

## Formato de Errores

Formato estándar de respuestas de error:

```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string"
}
```

---

## Información No Implementada

Los siguientes endpoints están definidos en la arquitectura pero requieren implementación:

1. **Refresh Token**: La estrategia de refresh token está definida pero el endpoint no está implementado
2. **MercadoPago**: Proveedor de pagos configurado pero no implementado completamente
3. **Stripe Webhook**: Endpoint existente pero pendiente de implementación completa
4. **Workflow Machine**: Archivo `workflow.machine.ts` está vacío, la lógica está en `workflows.service.ts`
5. **Health Check**: Endpoint básico existente pero sin métricas detalladas

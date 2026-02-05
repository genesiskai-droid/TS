# Documentación de Workflows - TS360 Technical Service

## 1. Introducción

El sistema TS360 implementa una máquina de estados finitos (Finite State Machine) para gestionar el ciclo de vida de los procesos de negocio. Los workflows representan procesos empresariales con estados definidos y transiciones permitidas controladas por roles.

**Nota importante:** El archivo `workflow.machine.ts` está vacío. La lógica de la máquina de estados está implementada directamente en `workflows.service.ts`.

---

## 2. Estados del Workflow Principal

### 2.1 Estados Definidos

| Estado | Descripción | Tipo |
|--------|------------|------|
| `PENDING` | Pendiente de iniciar | Inicial |
| `IN_PROGRESS` | En progreso | Intermedio |
| `COMPLETED` | Completado exitosamente | Final |
| `FAILED` | Falló por algún error | Final recuperable |
| `CANCELLED` | Cancelado por el usuario | Final |

### 2.2 Diagrama de Transiciones de Estados

```
                              ┌─────────────────┐
                              │                 │
              ┌──────────────▶│    PENDING      │◀──────────────┐
              │               │                 │               │
              │               └────────┬────────┘               │
              │                        │                        │
              │                        │ START                  │
              │                        ▼                        │
              │               ┌─────────────────┐               │
              │               │                 │               │
    ┌─────────┴─────────────▶│   IN_PROGRESS   │◀─────────────┴─────────┐
    │                        │                 │                          │
    │                        └────────┬────────┘                          │
    │                                 │                                     │
    │                                 │ COMPLETE                            │
    │                                 ▼                                     │
    │                        ┌─────────────────┐                            │
    │                        │                 │                            │
    │        ┌──────────────│   COMPLETED     │──────────────┐             │
    │        │               │                 │              │             │
    │        │               └─────────────────┘              │             │
    │        │                                                 │             │
    │        │ CANCEL                                         │ FAILED      │
    │        │                                                 │             │
    │        ▼                                                 ▼             │
    │  ┌─────────────────┐                              ┌─────────────────┐ │
    │  │                 │                              │                 │ │
    │  │    CANCELLED    │──────────────────────────────│     FAILED      │ │
    │  │                 │            CANCEL            │                 │ │
    │  └─────────────────┘                              └─────────────────┘ │
    │                                                                           │
    │                              RETRY                                        │
    │                                  │                                        │
    └──────────────────────────────────┼────────────────────────────────────────┘
                                       ▼
                              ┌─────────────────┐
                              │     PENDING     │
                              └─────────────────┘
```

---

## 3. Matriz de Transiciones

### 3.1 Transiciones Permitidas

| Estado Actual | Estado Siguiente | Evento | Roles Autorizados |
|--------------|------------------|--------|-------------------|
| `PENDING` | `IN_PROGRESS` | START | ADMIN, MANAGER, TECNICO |
| `PENDING` | `CANCELLED` | CANCEL | ADMIN, MANAGER, CLIENT |
| `IN_PROGRESS` | `COMPLETED` | COMPLETE | ADMIN, MANAGER, TECNICO |
| `IN_PROGRESS` | `FAILED` | ESCALATE | ADMIN, MANAGER, TECNICO |
| `IN_PROGRESS` | `CANCELLED` | CANCEL | ADMIN, MANAGER, CLIENT |
| `FAILED` | `PENDING` | RETRY | ADMIN, MANAGER |
| `FAILED` | `CANCELLED` | CANCEL | ADMIN, MANAGER, CLIENT |

### 3.2 Transiciones No Permitidas

| Desde | Hacia | Razón |
|-------|-------|-------|
| `COMPLETED` | Cualquiera | Estado terminal |
| `CANCELLED` | Cualquiera | Estado terminal |
| `PENDING` | `COMPLETED` | Debe pasar por IN_PROGRESS |
| `PENDING` | `FAILED` | No tiene sentido directo |

---

## 4. Implementación Técnica

### 4.1 Definición de Transiciones en Código

Las transiciones están definidas en `workflows.service.ts`:

```typescript
private readonly transitions: Record<string, any[]> = {
  PENDING: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  FAILED: ['PENDING', 'CANCELLED'],
  CANCELLED: [],
};
```

### 4.2 Lógica de Transición

```typescript
async transition(
  id: string,
  nextState: string,
  event: string,
  actorId: string,
  reason?: string,
) {
  const workflow = await this.getById(id);
  const allowed = this.transitions[workflow.currentState] || [];

  if (!allowed.includes(nextState)) {
    throw new BadRequestException(
      `Invalid transition from ${workflow.currentState} to ${nextState}`,
    );
  }

  const previousState = workflow.currentState;

  return this.prisma.workflow.update({
    where: { id },
    data: {
      currentState: nextState as any,
      event: event as any,
      metadata: {
        previousState,
        actorId,
        reason,
        transitionedAt: new Date().toISOString(),
      } as any,
    },
  });
}
```

### 4.3 Metadatos de Transición

Cada transición registra los siguientes metadatos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| previousState | string | Estado anterior del workflow |
| actorId | string | ID del usuario que realizó la transición |
| reason | string (opcional) | Razón o nota de la transición |
| transitionedAt | DateTime | Timestamp de la transición |

---

## 5. Eventos del Workflow

### 5.1 Tipos de Eventos Definidos

| Evento | Descripción | Estados de Origen |
|--------|------------|-------------------|
| `START` | Iniciar proceso | PENDING |
| `CONFIRM` | Confirmar acción | PENDING, IN_PROGRESS |
| `ASSIGN` | Asignar recurso | PENDING, IN_PROGRESS |
| `START_WORK` | Iniciar trabajo | ASIGNADO |
| `COMPLETE` | Completar tarea | IN_PROGRESS |
| `CANCEL` | Cancelar proceso | Cualquier estado no terminal |
| `ESCALATE` | Escalar a otro nivel | IN_PROGRESS |

---

## 6. Flujo de Reservas (Booking Workflow)

### 6.1 Ciclo de Vida de una Reserva

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ESTADOS DE RESERVA                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│   │Registrado│───▶│EnRevision│───▶│ Asignado│───▶│ EnProceso│           │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘           │
│        │                                         │                         │
│        │                                         │                         │
│        ▼                                         ▼                         │
│   ┌──────────┐                          ┌──────────┐                    │
│   │Cancelado│                          │Esperando│                    │
│   └──────────┘                          │Repuestos│                    │
│                                          └──────────┘                     │
│                                               │                            │
│                                               │                            │
│                                               ▼                            │
│                                          ┌──────────┐                     │
│                                          │ ListoPara│                     │
│                                          │ Entrega  │                     │
│                                          └──────────┘                     │
│                                               │                            │
│                      ┌────────────────────────┤                             │
│                      │                        │                             │
│                      ▼                        ▼                             │
│                ┌──────────┐             ┌──────────┐                      │
│                │ Entregado│             │Cancelado│                      │
│                └──────────┘             └──────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Detalle de Estados de Reserva

| Estado | Descripción | Acciones Posibles |
|--------|------------|-------------------|
| `Registrado` | Nueva solicitud creada por el cliente | Revisar, Cancelar |
| `EnRevision` | En evaluación inicial del sistema | Asignar técnico, Cancelar |
| `Asignado` | Técnico asignado a la reserva | Iniciar trabajo, Cancelar |
| `EnProceso` | Trabajo en curso por el técnico | Esperar repuestos, Completar, Cancelar |
| `EsperandoRepuestos` | Esperando materiales o repuestos | Completar, Cancelar |
| `ListoParaEntrega` | Servicio completado, listo para entregar | Entregar al cliente, Cancelar |
| `Entregado` | Cliente recibió el equipo/servicio | Finalizar workflow |
| `Cancelado` | Reserva cancelada por alguna razón | - |

---

## 7. Flujo de Pagos

### 7.1 Estados de Pago

| Estado | Descripción |
|--------|------------|
| `PENDING` | Pago esperando confirmación del proveedor |
| `COMPLETED` | Pago exitoso confirmado |
| `FAILED` | Pago falló o fue rechazado |
| `CANCELED` | Pago cancelado por el usuario |

### 7.2 Diagrama de Estados de Pago

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ PENDING  │───▶│COMPLETED │     COMPLETED │
└──────────┘    └──────────┘    └──────────┘
     │               │
     │               │ FAILED
     │               ▼
     │         ┌──────────┐
     │         │  FAILED  │
     │         └──────────┘
     │               │
     │               │ CANCEL
     ▼               ▼
┌──────────┐   ┌──────────┐
│CANCELED  │   │CANCELED  │
└──────────┘   └──────────┘
```

---

## 8. Flujo de SOS (Emergencias)

### 8.1 Estados de SOS

**Nota:** Existen dos enums diferentes para estados SOS:
- En `sos.service.ts`: PENDING, ACKNOWLEDGED, RESOLVED
- En `sos-status.enum.ts`: Activo, EnProceso, Resuelto, Cancelado

**Esta discrepancia debe resolverse en el código.**

### 8.2 Ciclo de Vida de SOS

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ PENDING  │───▶│ACKNOWLEDG│───▶│ RESOLVED │
│          │    │    ED    │    │          │
└──────────┘    └──────────┘    └──────────┘
     │               │
     │               │ RESOLVE
     │               ▼
     │         ┌──────────┐
     │         │ RESOLVED │
     │         └──────────┘
     │
     │ CANCEL
     ▼
┌──────────┐
│CANCELED  │
└──────────┘
```

### 8.3 Prioridades de SOS

| Prioridad | Descripción |
|-----------|------------|
| `LOW` | Baja prioridad |
| `MEDIUM` | Prioridad media |
| `HIGH` | Alta prioridad |
| `CRITICAL` | Emergencia crítica |

---

## 9. APIs de Workflow

### 9.1 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/workflows/:id` | Obtener workflow por ID |
| GET | `/workflows/booking/:bookingId` | Obtener workflow por reserva |
| PATCH | `/workflows/:id/transition` | Realizar transición de estado |

### 9.2 Ejemplo de Transición

**Petición:**
```
PATCH /workflows/:id/transition
Authorization: Bearer <token JWT>

{
  "nextStatus": "COMPLETED"
}
```

**Respuesta:**
```json
{
  "id": "uuid-workflow",
  "name": "Reserva #123",
  "currentState": "COMPLETED",
  "event": "COMPLETE",
  "metadata": {
    "previousState": "IN_PROGRESS",
    "actorId": "uuid-tecnico",
    "transitionedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 10. Auditoría de Workflows

El sistema registra automáticamente cada transición de workflow:

1. **Identificación del workflow**
2. **Estado anterior y nuevo**
3. **Evento que disparó la transición**
4. **Actor que realizó la acción** (desde el token JWT)
5. **Timestamp de la transición**
6. **Razón u observación** (cuando se proporciona)

La auditoría está integrada con el `AuditInterceptor` global que captura todas las requests.

---

## 11. Mejores Prácticas

### 11.1 Validación de Transiciones

```typescript
try {
  await workflowService.transition(id, nextState, event, actorId);
} catch (error) {
  if (error instanceof BadRequestException) {
    // Transición inválida
    // Registrar y notificar al usuario
  }
  throw error;
}
```

### 11.2 Recomendaciones

1. **Definir estados claramente**: Cada estado debe representar un punto claro en el proceso
2. **Limitar estados finales**: Minimizar estados terminales para permitir recuperaciones
3. **Validar transiciones**: Siempre verificar que la transición sea válida antes de ejecutar
4. **Registrar metadatos**: Capturar contexto adicional cuando sea posible
5. **Notificar cambios**: Enviar notificaciones a usuarios afectados

---

## 12. Información Adicional

### 12.1 Notas de Implementación

- El archivo `workflow.machine.ts` está vacío. La lógica está implementada directamente en `workflows.service.ts`.
- La tabla de transiciones está hardcodeada en el servicio.
- No existe validación por tipo de workflow (todos usan la misma tabla de transiciones).

### 12.2 Mejoras Sugeridas

1. Implementar el archivo `workflow.machine.ts` con lógica de máquina de estados más robusta
2. Crear un sistema de definición de workflows configurable
3. Agregar validación de roles por transición de estado
4. Implementar transiciones asíncronas con callback
5. Agregar historial completo de transiciones en tabla separada

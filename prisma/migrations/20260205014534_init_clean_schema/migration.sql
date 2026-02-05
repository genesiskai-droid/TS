-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('Senior', 'Semi_Senior', 'Novato');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('Mantenimiento', 'Incidente', 'Instalacion', 'SOS');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('Registrado', 'Asignado', 'En_Taller', 'En_Ruta', 'En_Diagnostico', 'Esperando_Aprobacion', 'En_Reparacion', 'Control_Calidad', 'Reparado', 'Pago', 'Entrega', 'Cancelado');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Baja', 'Normal', 'Alta', 'Critica');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('Taller', 'Domicilio');

-- CreateEnum
CREATE TYPE "ClientResponse" AS ENUM ('approved', 'rejected', 'customer_parts');

-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('boleta', 'factura');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BOLETO', 'EFECTIVO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TICKET_CREATED', 'TICKET_ASSIGNED', 'TICKET_STATUS_CHANGED', 'PAYMENT_RECEIVED', 'SOS_ALERT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'CAJA', 'TECH', 'CLIENT');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_staff" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "seniority" "Seniority" NOT NULL,
    "specialty" TEXT NOT NULL,
    "secondarySkills" TEXT[],
    "address" TEXT NOT NULL,
    "currentWorkload" INTEGER NOT NULL DEFAULT 0,
    "isVersatile" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technical_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'Registrado',
    "priority" "Priority" NOT NULL DEFAULT 'Normal',
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "observations" TEXT,
    "cost" DOUBLE PRECISION,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "modality" "Modality" NOT NULL,
    "isSOS" BOOLEAN NOT NULL DEFAULT false,
    "sosApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "technicalStaffId" TEXT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_entries" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "history_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "received_items" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "received_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_details" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "subServices" TEXT[],
    "basePrice" DOUBLE PRECISION NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "device_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_reports" (
    "id" TEXT NOT NULL,
    "techNotes" TEXT NOT NULL,
    "laborCost" DOUBLE PRECISION,
    "priceAdjustment" DOUBLE PRECISION,
    "adjustmentReason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientResponse" "ClientResponse",
    "clientNote" TEXT,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "technical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "technicalReportId" TEXT NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_details" (
    "id" TEXT NOT NULL,
    "type" "BillingType" NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clientId" TEXT,
    "ticketId" TEXT,

    CONSTRAINT "billing_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL,
    "months" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    "ticketId" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_assignments" (
    "id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "technicalStaffId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "ticket_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "payload" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interactions" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tokens" INTEGER,
    "metadata" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "technical_staff_dni_key" ON "technical_staff"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "technical_staff_email_key" ON "technical_staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "device_details_ticketId_key" ON "device_details"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "technical_reports_ticketId_key" ON "technical_reports"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_details_ticketId_key" ON "billing_details"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "warranties_ticketId_key" ON "warranties"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_technicalStaffId_fkey" FOREIGN KEY ("technicalStaffId") REFERENCES "technical_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_entries" ADD CONSTRAINT "history_entries_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "received_items" ADD CONSTRAINT "received_items_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_details" ADD CONSTRAINT "device_details_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_reports" ADD CONSTRAINT "technical_reports_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_technicalReportId_fkey" FOREIGN KEY ("technicalReportId") REFERENCES "technical_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_details" ADD CONSTRAINT "billing_details_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_details" ADD CONSTRAINT "billing_details_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_technicalStaffId_fkey" FOREIGN KEY ("technicalStaffId") REFERENCES "technical_staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

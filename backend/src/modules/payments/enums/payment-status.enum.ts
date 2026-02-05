export enum PaymentProvider {
  STRIPE = 'STRIPE',
  MERCADOPAGO = 'MERCADOPAGO',
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  PEN = 'PEN',
}
export enum Recurrence {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

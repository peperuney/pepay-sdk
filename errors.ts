export class PepayError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'PepayError';
    }
}

export const ErrorCodes = {
    // Network Validation (400)
    NETWORK_NOT_SUPPORTED: 'NETWORK_NOT_SUPPORTED',
    NETWORK_NOT_ENABLED: 'NETWORK_NOT_ENABLED',

    // Authentication (401)
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    INVALID_SIGNATURE: 'INVALID_SIGNATURE',
    INVALID_API_KEY: 'INVALID_API_KEY',

    // Resource Errors (404)
    INVOICE_NOT_FOUND: 'INVOICE_NOT_FOUND',
    MERCHANT_NOT_FOUND: 'MERCHANT_NOT_FOUND',

    // Invoice Validation (400)
    INVALID_AMOUNT_FORMAT: 'INVALID_AMOUNT_FORMAT',
    INVALID_AMOUNT_RANGE: 'INVALID_AMOUNT_RANGE',
    METADATA_TOO_LARGE: 'METADATA_TOO_LARGE',
    IDEMPOTENCY_KEY_MISSING: 'IDEMPOTENCY_KEY_MISSING',
    INVALID_EXPIRATION_FORMAT: 'INVALID_EXPIRATION_FORMAT',
    INVALID_EXPIRATION_RANGE: 'INVALID_EXPIRATION_RANGE',

    // Processing Errors (500)
    WALLET_GENERATION_FAILED: 'WALLET_GENERATION_FAILED',
    ENCRYPTION_FAILED: 'ENCRYPTION_FAILED',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INVOICE_CREATE_FAILED: 'INVOICE_CREATE_FAILED'
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

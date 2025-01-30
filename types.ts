export interface CreateInvoiceParams {
    amount_usd: number;
    description?: string;
    customer_id?: string;
    metadata?: Record<string, any>;
    expires_in?: number;
}

export interface Invoice {
    invoice_id: string;
    payment_url: string;
    expires_at: string;
    status: 'paid' | 'unpaid' | 'expired';
    amount_usd: number;
    customer_id?: string;
    description?: string;
}

export interface InvoiceTotals {
    total_amount_usd: number;
    total_paid_usd: number;
    total_unpaid_usd: number;
    total_expired_usd: number;
    invoice_count: {
        total: number;
        paid: number;
        unpaid: number;
        expired: number;
    }
}

export interface WebhookEvent {
    id: string;
    type: string;
    created: number;
    data: {
        invoice_id: string;
        status: 'paid' | 'expired' | 'partial_payment' | 'overpaid';
        amount_paid?: number;
        payment_network?: string;
        transaction_hash?: string;
    };
}
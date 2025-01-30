import { CreateInvoiceParams, Invoice, InvoiceTotals } from './types';
import { PepayError } from './errors';
import crypto from 'crypto';

export class PepaySDK {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, options?: { baseUrl?: string }) {
        this.apiKey = apiKey;
        this.baseUrl = options?.baseUrl || 'https://api.pepay.io';
    }

    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'X-API-Key': this.apiKey,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new PepayError(
                error.error,
                error.code,
                response.status
            );
        }

        return response.json();
    }

    // Invoice Methods
    async createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
        return this.request('/api/v1/invoices', {
            method: 'POST',
            headers: {
                'Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify(params),
        });
    }

    async listInvoices(params?: { page?: number; status?: 'paid' | 'unpaid' | 'expired' | 'all' }) {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.status) searchParams.set('status', params.status);

        return this.request(`/api/v1/invoices?${searchParams.toString()}`);
    }

    async getCustomerInvoices(customerId: string) {
        return this.request(`/api/v1/invoices/customer/${customerId}`);
    }

    async getInvoiceTotals(): Promise<InvoiceTotals> {
        return this.request('/api/v1/invoices/totals');
    }
}
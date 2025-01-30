
# PEPAY SDK Documentation

PEPAY is a cryptocurrency payment processing platform that allows merchants to accept various cryptocurrencies while receiving stable USD payments. This SDK provides easy integration with the PEPAY API.

## Installation

```bash
npm install @pepay/sdk
# or
yarn add @pepay/sdk
```

## Quick Start

```typescript
import { PepaySDK } from '@pepay/sdk';

const pepay = new PepaySDK('your_api_key');

// Create an invoice
const invoice = await pepay.createInvoice({
    amount_usd: 99.99,
    description: 'Premium Subscription',
    customer_id: 'cust_123'
});
```

## Core Concepts

### Invoices
Invoices are the primary way to request payments from your customers. Each invoice:
- Has a unique ID
- Contains the amount in USD
- Automatically expires after a set duration (default: 12 hours)
- Provides a payment URL for customers

### Authentication
All requests require an API key. You can generate API keys in your PEPAY dashboard.

## API Reference

### Creating Invoices

```typescript
const invoice = await pepay.createInvoice({
    amount_usd: 100.00,          // Required: Amount in USD
    description: 'Order #1234',   // Optional: Invoice description
    customer_id: 'cust_123',      // Optional: Your customer identifier
    metadata: {                   // Optional: Additional data
        order_id: '1234',
        product_id: 'prod_456'
    },
    expires_in: 3600000          // Optional: Custom expiration (in ms)
});
```

### Listing Invoices

```typescript
// Get all invoices (paginated)
const invoices = await pepay.listInvoices({
    page: 1,
    status: 'unpaid' // 'paid' | 'unpaid' | 'expired' | 'all'
});

// Get invoices for specific customer
const customerInvoices = await pepay.getCustomerInvoices('cust_123');
```

### Getting Invoice Totals

```typescript
const totals = await pepay.getInvoiceTotals();
// Returns:
{
    total_amount_usd: 1000.00,
    total_paid_usd: 750.00,
    total_unpaid_usd: 250.00,
    total_expired_usd: 0.00,
    invoice_count: {
        total: 10,
        paid: 7,
        unpaid: 3,
        expired: 0
    }
}


## Webhook Integration

PEPAY uses webhooks to notify your application in real-time about events that happen with your invoices. This allows you to automate your systems based on payment status changes.

### Setting Up Webhooks

1. Configure your webhook URL in the PEPAY dashboard
2. Store the webhook secret securely - you'll need this to verify webhook signatures
3. Implement a webhook endpoint in your application

### Webhook Events

PEPAY sends the following event types:
- `invoice.paid`: When an invoice is fully paid
- `invoice.expired`: When an invoice expires without payment
- `invoice.partial_payment`: When a partial payment is received
- `invoice.overpaid`: When an invoice receives more than the requested amount

### Implementing Webhook Handler

```typescript
import express from 'express';
import crypto from 'crypto';

const app = express();

// Important: Use raw body parser for webhook endpoints
app.post('/webhooks/pepay', 
  express.raw({ type: 'application/json' }), 
  (req, res) => {
    const signature = req.headers['x-pepay-signature'];
    const timestamp = req.headers['x-pepay-timestamp'];
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      req.body,
      signature,
      timestamp,
      process.env.WEBHOOK_SECRET
    );
    
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }
    
    const event = JSON.parse(req.body.toString());
    
    // Handle different event types
    switch (event.type) {
      case 'invoice.paid':
        await handlePaidInvoice(event.data);
        break;
      case 'invoice.expired':
        await handleExpiredInvoice(event.data);
        break;
      // ... handle other events
    }
    
    res.json({ received: true });
});
```

### Verifying Webhook Signatures

```typescript
function verifyWebhookSignature(
  payload: Buffer,
  signature: string,
  timestamp: string,
  secret: string
): boolean {
  const signedPayload = `${timestamp}.${payload.toString()}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Webhook Event Objects

```typescript
interface WebhookEvent {
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
```

### Best Practices

1. **Verify Signatures**: Always verify webhook signatures to ensure requests are from PEPAY
2. **Handle Retries**: Implement idempotency to handle potential duplicate webhook deliveries
3. **Quick Response**: Return a 200 status quickly and handle processing asynchronously
4. **Error Logging**: Log failed webhook processing for debugging
5. **Timeout Handling**: Set appropriate timeouts for webhook processing

### Testing Webhooks

1. Use the PEPAY dashboard to view webhook delivery attempts
2. Test using our webhook simulator in test mode
3. Use tools like ngrok for local development

### Monitoring and Debugging

- View webhook delivery attempts in your PEPAY dashboard
- Each webhook has a unique ID for tracking
- Failed webhooks are automatically retried with exponential backoff
- Set up webhook monitoring in your PEPAY dashboard

For more details on webhook implementation, see our [detailed webhook guide](https://docs.pepay.io/webhooks).
```

Would you like me to:
1. Add more webhook event types?
2. Include webhook retry configuration?
3. Add webhook security best practices?
4. Include webhook troubleshooting guide?


```

## Error Handling

The SDK throws `PepayError` for all API-related errors:

```typescript
try {
    const invoice = await pepay.createInvoice({
        amount_usd: 100
    });
} catch (error) {
    if (error instanceof PepayError) {
        console.error(`Error ${error.code}: ${error.message}`);
    }
}



```

Common error codes:
- `INVALID_AMOUNT_FORMAT`: Invalid amount format
- `INVALID_AMOUNT_RANGE`: Amount outside allowed range
- `IDEMPOTENCY_KEY_MISSING`: Missing idempotency key
- `INVOICE_CREATE_FAILED`: Generic creation failure

## Best Practices

1. **Idempotency**: All write operations are idempotent using a unique UUIDV4 or above 
2. **Error Handling**: Always implement proper error handling
3. **Webhook Integration**: Set up webhooks for real-time payment updates
4. **Amount Validation**: Ensure amounts are between 0.01 and 1,000,000.00 USD
5. **Expiration Times**: Consider your use case when setting custom expiration time







## Support

- Documentation: https://docs.pepay.io
- API Status: https://status.pepay.io
- Support Email: support@peperuney.pizza



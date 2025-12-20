# `services/billing-service/`

Billing, subscription, and usage metering (from architecture section 23).

Responsibilities:
- Subscribe to billable events (mint/retire/API usage)
- Maintain usage ledger per tenant and enforce quotas
- Integrate with payment processor (e.g., Stripe)
- Emit `billing.*` events (usage recorded, invoice generated, payment status)



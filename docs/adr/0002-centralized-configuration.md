# 2. Centralized Configuration

Date: 2025-12-15

## Status

Accepted

## Context

Configuration values such as API keys (Formspree), social media links, and contact information were duplicated across multiple components (`Hero`, `Contact`, `Footer`) and localization files (`en.ts`, `fr.ts`, `es.ts`). This made updates error-prone and difficult to maintain.

## Decision

We will centralize all static configuration and "magic strings" into a single file: `src/lib/constants.ts`.
This file will export a `SITE_CONFIG` object containing:
- Contact details (email, phone, address).
- Social media URLs.
- Service IDs (Formspree).

## Consequences

### Positive
- **Single Source of Truth**: Updating a value in `constants.ts` propagates everywhere.
- **Maintainability**: Reduced risk of inconsistent data (e.g., different phone numbers in Footer vs Hero).
- **Type Safety**: TypeScript ensures keys are consistent.

### Negative
- **Indirection**: Developers must look up the value in `constants.ts` rather than seeing it inline (minor).
